import React, { Component } from 'react'
import classNames from 'classnames'
import { Icon } from '@kube-design/components'

import styles from './index.scss'

export default class ClustersMapper extends Component {
  isOverride = name => {
    const { overrides } = this.props

    if (!overrides) {
      return false
    }

    return overrides.some(ord => ord.clusterName === name)
  }

  render() {
    const { clusters, children } = this.props

    return (
      <div className={styles.wrapper}>
        {clusters.map(({ name }) => {
          const selected = this.isOverride(name)
          return (
            <div
              key={name}
              className={classNames(styles.cluster, {
                [styles.selected]: selected,
              })}
            >
              <div className={styles.title}>
                <Icon name="kubernetes" type="light" size={20} />
                <span>{name}</span>
              </div>
              <div>{children({ cluster: name, selected })}</div>
            </div>
          )
        })}
      </div>
    )
  }
}
