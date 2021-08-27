import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { isEmpty, isFunction } from 'lodash'

import { cacheFunc } from 'utils'
import { startAutoRefresh, stopAutoRefresh } from 'utils/monitoring'

import { Loading } from '@kube-design/components'
import { Card, Empty } from 'components/Base'

import styles from './index.scss'

export default class StatusTabs extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    tabOptions: PropTypes.array,
    contentOptions: PropTypes.array,
    loading: PropTypes.bool,
    refreshing: PropTypes.bool,
    onFetch: PropTypes.func,
  }

  static defaultProps = {
    title: '',
    tabOptions: [],
    contentOptions: [],
    loading: true,
    refreshing: false,
    onFetch() {},
  }

  constructor(props) {
    super(props)

    this.state = {
      activeIndex: 0,
    }

    this.fetchData()
  }

  componentDidMount() {
    startAutoRefresh(this, {
      interval: 10000,
      leading: false,
    })
  }

  componentWillUnmount() {
    stopAutoRefresh(this)
  }

  fetchData = (params = {}) => {
    this.props.onFetch(params)
  }

  handleTabClick = index =>
    cacheFunc(
      `_tab_${index}`,
      () => {
        this.setState({ activeIndex: Number(index) })
      },
      this
    )

  renderTabList() {
    const { tabOptions } = this.props
    const { activeIndex } = this.state

    if (isEmpty(tabOptions)) return null

    return (
      <div className={styles.tabList}>
        {tabOptions.map((op, index) => {
          const isActive = index === activeIndex
          const Component = op.component
          const render = op.render
          const props = {
            ...op.props,
            active: isActive,
          }

          return (
            <div
              key={index}
              className={classnames(styles.tab, {
                [styles.active]: isActive,
              })}
              onClick={this.handleTabClick(index)}
            >
              <i className={styles.img} />
              <div className={styles.inner}>
                {isFunction(render) ? render(props) : <Component {...props} />}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  renderTabContent() {
    const { contentOptions } = this.props
    const { activeIndex } = this.state
    const op = contentOptions[activeIndex] || {}
    const Component = op.component
    const render = op.render
    const props = {
      ...op.props,
    }

    return (
      <div className={styles.tabContent}>
        <div className={styles.inner}>
          {isEmpty(contentOptions) ? (
            <Empty />
          ) : isFunction(render) ? (
            render(props)
          ) : (
            <Component {...props} />
          )}
        </div>
      </div>
    )
  }

  render() {
    const { className, title, loading } = this.props

    return (
      <Card className={classnames(styles.card, className)} title={title}>
        <Loading spinning={loading}>
          <div className={styles.content}>
            {this.renderTabList()}
            {this.renderTabContent()}
          </div>
        </Loading>
      </Card>
    )
  }
}
