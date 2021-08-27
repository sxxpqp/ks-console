import { get, keyBy } from 'lodash'
import React, { Component } from 'react'
import { Icon, Tag } from '@kube-design/components'
import StatusReason from 'projects/components/StatusReason'
import { CLUSTER_PROVIDER_ICON, CLUSTER_GROUP_TAG_TYPE } from 'utils/constants'
import { getWorkloadStatus } from 'utils/status'

import styles from './index.scss'

export default class FedWorkloadStatus extends Component {
  render() {
    const { data, clusters, module } = this.props
    const clustersDetail = keyBy(clusters, 'name')

    return (
      <div className={styles.wrapper}>
        <div className={styles.tags}>
          {data.clusters.map(item => {
            const cluster = clustersDetail[item.name]

            if (!cluster) {
              return null
            }

            const resource = get(data, `resources[${cluster.name}]`, {})
            const replicas = get(
              data,
              `clusterTemplates[${cluster.name}].spec.replicas`,
              0
            )
            const { status, reason } = getWorkloadStatus(resource, module)

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
                <span>
                  {resource.availablePodNums || resource.readyPodNums || 0} /{' '}
                  {replicas}
                </span>
                &nbsp;
                {reason && <StatusReason status={status} data={resource} />}
              </Tag>
            )
          })}
        </div>
        <p>
          {t('REPLICAS_AVAILABLE')}/{t('REPLICAS_EXPECTED')}
        </p>
      </div>
    )
  }
}
