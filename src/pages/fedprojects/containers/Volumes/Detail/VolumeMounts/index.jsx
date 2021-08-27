import React from 'react'
import { observer, inject } from 'mobx-react'
import { keyBy } from 'lodash'

import PodsCard from './PodsCard'

import styles from './index.scss'

@inject('detailStore', 'projectStore')
@observer
class ResourceStatus extends React.Component {
  get store() {
    return this.props.detailStore
  }

  get clusterMap() {
    return keyBy(this.props.projectStore.detail.clusters, 'name')
  }

  render() {
    const { clusters } = this.store.detail
    return (
      <div className={styles.main}>
        {clusters.map(cluster => (
          <PodsCard
            key={cluster.name}
            match={this.props.match}
            cluster={this.clusterMap[cluster.name] || cluster}
          />
        ))}
      </div>
    )
  }
}

export default ResourceStatus
