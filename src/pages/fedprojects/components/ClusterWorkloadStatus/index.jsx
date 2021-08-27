import React, { Component } from 'react'

import { Panel } from 'components/Base'

import Cluster from './Cluster'

import styles from './index.scss'

export default class ClusterWorkloadStatus extends Component {
  handleReplicasChange = async (cluster, replicas) => {
    const { detail, store } = this.props
    const { overrides = [] } = detail

    const override = overrides.find(item => item.clusterName === cluster)
    if (override) {
      const path = override.clusterOverrides.find(
        item => item.path === '/spec/replicas'
      )
      if (path) {
        path.value = replicas
      } else {
        override.clusterOverrides.push({
          path: '/spec/replicas',
          value: replicas,
        })
      }
    } else {
      overrides.push({
        clusterName: cluster,
        clusterOverrides: [
          {
            path: '/spec/replicas',
            value: replicas,
          },
        ],
      })
    }

    await store.patch(detail, { spec: { overrides } })
    await store.resourceStore.patch(
      { ...detail, cluster },
      { spec: { replicas } }
    )
  }

  render() {
    const { store, resources, clusters, clustersDetail, canEdit } = this.props

    if (!clusters) {
      return null
    }

    return (
      <Panel title={t('Instance Status')}>
        <div className={styles.wrapper}>
          {clusters.map(cluster => {
            if (!clustersDetail[cluster.name]) {
              return null
            }
            return (
              <Cluster
                key={cluster.name}
                cluster={clustersDetail[cluster.name]}
                workload={resources[cluster.name]}
                onReplicasChange={canEdit ? this.handleReplicasChange : null}
                store={store}
              />
            )
          })}
        </div>
      </Panel>
    )
  }
}
