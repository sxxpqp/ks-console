import React, { Component } from 'react'
import { Icon } from '@kube-design/components'

import styles from './index.scss'

export default class Steps extends Component {
  render() {
    const { steps, current } = this.props
    return (
      <div className={styles.wrapper}>
        {steps.map((step, index) => (
          <div key={step.title}>
            {current >= index ? (
              <Icon name="success" type="coloured" size={12} />
            ) : (
              <Icon name="dot" type="light" size={12} />
            )}
            <span>{t(step.title)}</span>
          </div>
        ))}
      </div>
    )
  }
}
