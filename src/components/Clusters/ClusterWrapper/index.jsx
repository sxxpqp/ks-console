import React, { Component } from 'react'
import { Icon, Tag } from '@kube-design/components'
import { keyBy } from 'lodash'
import { CLUSTER_PROVIDER_ICON, CLUSTER_GROUP_TAG_TYPE } from 'utils/constants'

import styles from './index.scss'

export default class ClusterWrapper extends Component {
  render() {
    const clusterMap = keyBy(this.props.clustersDetail, 'name')
    const { children, clusters = [] } = this.props

    return (
      <div className={styles.wrapper}>
        <div className={styles.tags}>
          {clusters.map(item => {
            const cluster = clusterMap[item.name] || item
            return (
              <Tag
                key={cluster.name}
                type={CLUSTER_GROUP_TAG_TYPE[cluster.group]}
              >
                <Icon
                  name={CLUSTER_PROVIDER_ICON[cluster.provider] || 'kubernetes'}
                  size={16}
                  type="light"
                />
                {children ? children(cluster) : cluster.name}
              </Tag>
            )
          })}
        </div>
      </div>
    )
  }
}
