import { isEmpty } from 'lodash'
import React from 'react'
import { PropTypes } from 'prop-types'
import { Icon, Dropdown } from '@kube-design/components'
import isEqual from 'react-fast-compare'

import Item from './Item'

import styles from './index.scss'

export default class ServiceSelect extends React.Component {
  static propTypes = {
    defaultValue: PropTypes.object,
    options: PropTypes.array,
    onChange: PropTypes.func,
    isLoading: PropTypes.bool,
  }

  static defaultProps = {
    options: [],
    onChange() {},
    isLoading: true,
  }

  state = {
    value: this.props.defaultValue || this.props.options[0] || {},
  }

  componentDidUpdate(prevProps) {
    const { options, defaultValue } = this.props
    if (!isEqual(options, prevProps.options)) {
      this.setState({ value: defaultValue || options[0] })
    }
  }

  handleChange = value => {
    this.setState({ value }, () => {
      this.props.onChange(value)
    })
  }

  renderOptions() {
    const { options } = this.props
    return (
      <ul className={styles.options}>
        {options.map(item => (
          <li key={item.uid}>
            <Item data={item} onClick={this.handleChange} />
          </li>
        ))}
      </ul>
    )
  }

  render() {
    const { isLoading, options } = this.props
    return (
      <div className={styles.select}>
        {!isLoading && isEmpty(options) ? (
          <div className={styles.empty}>
            {t('NOT_AVAILABLE', { resource: t('Service') })}
          </div>
        ) : (
          <Dropdown
            trigger="click"
            placement="bottom"
            content={this.renderOptions()}
          >
            <div className={styles.control}>
              <Item className={styles.selected} data={this.state.value} />
              <Icon
                className={styles.rightIcon}
                name="chevron-down"
                size={24}
              />
            </div>
          </Dropdown>
        )}
      </div>
    )
  }
}
