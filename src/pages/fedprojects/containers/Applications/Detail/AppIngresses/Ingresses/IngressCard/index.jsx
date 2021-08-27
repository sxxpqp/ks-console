import React, { Component } from 'react'

import { isEmpty } from 'lodash'

import Rule from 'fedprojects/containers/Routes/Detail/ResourceStatus/Rule'

import styles from './index.scss'

export default class IngressCard extends Component {
  render() {
    const { prefix, gateway, detail } = this.props

    const tls = detail.tls || []

    if (isEmpty(detail.rules)) {
      return null
    }

    return (
      <div className={styles.wrapper}>
        {detail.rules.map(rule => (
          <Rule
            key={rule.host}
            tls={tls}
            rule={rule}
            gateway={gateway}
            prefix={prefix}
          />
        ))}
      </div>
    )
  }
}
