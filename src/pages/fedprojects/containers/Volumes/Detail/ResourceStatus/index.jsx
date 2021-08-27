import React from 'react'
import { observer, inject } from 'mobx-react'

import { keyBy } from 'lodash'
import { Alert } from '@kube-design/components'
import UsageCard from './UsageCard'

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
        <Alert
          type="warning"
          className="margin-b12"
          message={t.html('VOLUME_MONITORING_TIP')}
        />
        {clusters.map(cluster => (
          <UsageCard
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
