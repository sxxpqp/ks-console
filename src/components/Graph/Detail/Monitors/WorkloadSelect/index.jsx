import React, { Component } from 'react'
import classNames from 'classnames'
import { Dropdown, Menu, Icon } from '@kube-design/components'

import styles from './index.scss'

export default class WorkloadSelect extends Component {
  handleOptionsClick = (e, key) => {
    this.props.onChange(key)
  }

  renderOptions() {
    const { options } = this.props

    return (
      <Menu className={styles.options} onClick={this.handleOptionsClick}>
        {options.map(option => (
          <Menu.MenuItem key={option.value}>{option.label}</Menu.MenuItem>
        ))}
      </Menu>
    )
  }

  renderControl() {
    const { className, value } = this.props
    return (
      <div className={classNames(styles.value, className)}>
        <span className={styles.label}>{value}</span>
        <Icon className={styles.rightIcon} name="chevron-down" type="light" />
      </div>
    )
  }

  render() {
    return (
      <Dropdown theme="dark" content={this.renderOptions()}>
        {this.renderControl()}
      </Dropdown>
    )
  }
}
