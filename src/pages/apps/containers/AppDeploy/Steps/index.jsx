import React, { Component } from 'react'
import classNames from 'classnames'

import styles from './index.scss'

export default class Steps extends Component {
  render() {
    const { steps, current } = this.props
    return (
      <div className={styles.wrapper}>
        {steps.map((step, index) => (
          <div key={step.title}>
            <span
              className={classNames(styles.indicator, {
                [styles.fullfill]: current > index,
                [styles.current]: current === index,
                [styles.pending]: current < index,
              })}
            />
            <span>{t(step.title)}</span>
          </div>
        ))}
      </div>
    )
  }
}
