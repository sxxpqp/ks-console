import React, { Component } from 'react'
import classNames from 'classnames'
import { Icon } from '@kube-design/components'
import { CLUSTER_PROVIDER_ICON } from 'utils/constants'

import styles from './index.scss'

export default class ClustersMapper extends Component {
  state = {
    selectCluster: '',
  }

  handleClick = e => {
    this.setState({
      selectCluster: e.currentTarget.dataset.cluster,
    })
  }

  handleSelect = cluster => {
    this.setState({
      selectCluster: cluster,
    })
  }

  render() {
    const { clusters, clustersDetail, namespace, children } = this.props
    const { selectCluster } = this.state

    return (
      <div className={styles.wrapper}>
        {clusters.map(cluster => {
          const clusterDetail = clustersDetail[cluster.name] || cluster
          return (
            <div
              key={clusterDetail.name}
              className={classNames(styles.cluster, {
                [styles.selected]: clusterDetail.name === selectCluster,
              })}
              onClick={this.handleClick}
              data-cluster={clusterDetail.name}
            >
              <div className={styles.title}>
                <Icon
                  name={CLUSTER_PROVIDER_ICON[clusterDetail.provider]}
                  type="light"
                  size={20}
                />
                <span>{clusterDetail.name}</span>
              </div>
              <div>
                {children({
                  namespace,
                  cluster: clusterDetail.name,
                  selected: clusterDetail.name === selectCluster,
                  onSelect: this.handleSelect,
                })}
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}
