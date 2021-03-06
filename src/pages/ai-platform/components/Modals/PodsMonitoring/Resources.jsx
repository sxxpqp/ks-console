import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { isEmpty, get, remove, throttle } from 'lodash'

import { cacheFunc } from 'utils'
import { ICON_TYPES } from 'utils/constants'
import { getSuitableValue } from 'utils/monitoring'

import { Checkbox, Icon, Loading, Notify } from '@kube-design/components'
import { Empty } from 'components/Base'

import styles from './index.scss'

export default class Resources extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    config: PropTypes.object,
    name: PropTypes.string,
    maxChecked: PropTypes.number,
    page: PropTypes.number,
    total: PropTypes.number,
    checked: PropTypes.array,
    data: PropTypes.array,
    onFetch: PropTypes.func,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    loading: false,
    config: {},
    name: 'Resources',
    maxChecked: 10,
    page: 1,
    total: 0,
    checked: [],
    data: [],
    onFetch() {},
    onChange() {},
  }

  constructor(props) {
    super(props)

    this.state = {
      showChecked: false,
    }
    this.listRef = React.createRef()
    this.throttleScroll = throttle(this.handleScroll, 100)
  }

  get icon() {
    return ICON_TYPES[this.props.name.toLowerCase()] || 'appcenter'
  }

  get checkedData() {
    const { checked, data } = this.props

    return data.filter(item => checked.includes(this.getItemName(item)))
  }

  getItemName = item => get(item, 'metric.pod', '-')

  getCurrentValue = item => {
    const { type, unitType } = this.props.config
    return getSuitableValue(get(item, 'value[1]'), unitType || type)
  }

  componentDidMount() {
    this.listNode = this.listRef.current
    if (this.listNode) {
      this.listNode.addEventListener('scroll', this.throttleScroll)
    }
  }

  componentWillUnmount() {
    if (this.listNode) {
      this.listNode.removeEventListener('scroll', this.throttleScroll)
    }
  }

  handleScroll = e => {
    const { target } = e
    const clientHeight = target.clientHeight
    const scrollHeight = target.scrollHeight
    const scrollTop = target.scrollTop
    const isBottom = clientHeight + scrollTop === scrollHeight

    const { data, page, total, onFetch } = this.props
    if (!this.scrolling && total !== data.length && isBottom) {
      this.scrolling = true
      onFetch({
        more: true,
        page: page + 1,
      }).then(() => {
        this.scrolling = false
      })
    }
  }

  toggleChecked = checked => {
    this.setState({ showChecked: checked })
  }

  handleCheck = item => {
    const name = this.getItemName(item)

    return cacheFunc(
      `_resource_${name}`,
      () => {
        const { maxChecked } = this.props
        const data = [...this.props.checked]

        if (data.includes(name)) {
          remove(data, resourceName => resourceName === name)
        } else if (data.length >= maxChecked) {
          Notify.info({ content: t('MONITORING_SELECT_LIMIT_MSG') })
        } else {
          data.push(name)
        }

        this.props.onChange(data)
      },
      this
    )
  }

  renderResourceItem = item => {
    const { checked } = this.props
    const name = this.getItemName(item)
    const currentValue = this.getCurrentValue(item)

    return (
      <div key={name} className={styles.item} onClick={this.handleCheck(item)}>
        <Checkbox
          className={styles.itemCheck}
          checked={checked.includes(name)}
        />
        <Icon name={this.icon} size={16} />
        <div className={styles.itemInfo}>
          <strong title={name}>{name}</strong>
          <p>
            {t('Current')}: {currentValue}
          </p>
        </div>
      </div>
    )
  }

  renderResourceList = data =>
    isEmpty(data) ? <Empty /> : data.map(this.renderResourceItem)

  render() {
    const { loading, name } = this.props
    const { showChecked } = this.state
    const data = showChecked ? this.checkedData : this.props.data

    return (
      <div className={styles.resources}>
        <div className={styles.title}>
          <strong>{t(name)}</strong>
          <Checkbox checked={showChecked} onChange={this.toggleChecked}>
            {t('Only Show Selected')}
          </Checkbox>
        </div>
        <div className={styles.content}>
          <Loading spinning={loading}>
            <div className={styles.list}>
              <div
                className={classnames({
                  [styles.hide]: !showChecked,
                })}
              >
                {this.renderResourceList(data)}
              </div>
              <div
                className={classnames({
                  [styles.hide]: showChecked,
                })}
                ref={this.listRef}
              >
                {this.renderResourceList(data)}
              </div>
            </div>
          </Loading>
        </div>
      </div>
    )
  }
}
