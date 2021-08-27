import React, { Component } from 'react'
import { Button } from '@kube-design/components'

import styles from './index.scss'

export default class RadioButtons extends Component {
  handleClick = e => {
    this.props.onChange(e.currentTarget.dataset.value)
  }

  render() {
    const { value, options } = this.props
    return (
      <div className={styles.buttons}>
        {options.map(option => (
          <Button
            key={option.value}
            icon={option.icon}
            iconType={value === option.value ? 'light' : 'dark'}
            type={value === option.value ? 'control' : 'default'}
            data-value={option.value}
            onClick={this.handleClick}
          >
            {t(option.label)}
          </Button>
        ))}
      </div>
    )
  }
}
