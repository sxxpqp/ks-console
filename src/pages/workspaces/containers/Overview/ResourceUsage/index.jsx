import React from 'react'
import { inject, observer } from 'mobx-react'
import EmptyList from 'components/Cards/EmptyList'
import StatusReason from 'clusters/components/StatusReason'

import ResourceStatistics from './Statistics'
import PhysicalResource from './Physical'
import VirtualResource from './Virtual'

import styles from './index.scss'

@inject('rootStore', 'workspaceStore')
@observer
class ResourceUsage extends React.Component {
  workspaceStore = this.props.workspaceStore

  get workspace() {
    return this.props.match.params.workspace
  }

  get clusters() {
    return this.workspaceStore.clusters.data
  }

  get clustersOpts() {
    return this.clusters.map(cluster => ({
      label: cluster.name,
      value: cluster.name,
      disabled: !cluster.isReady,
      cluster,
    }))
  }

  get clusterProps() {
    return {
      className: styles.clusterSelector,
      cluster: this.workspaceStore.cluster,
      options: this.clustersOpts,
      onChange: this.handleClusterChange,
      valueRenderer: this.valueRenderer,
      optionRenderer: this.optionRenderer,
      workspaceStore: this.workspaceStore,
    }
  }

  valueRenderer = option => `${t('Cluster')}: ${option.value}`

  optionRenderer = option => (
    <div>
      <div>{option.value}</div>
      {!option.cluster.isReady && (
        <div>
          <StatusReason data={option.cluster} noTip />
        </div>
      )}
    </div>
  )

  handleClusterChange = cluster => {
    this.workspaceStore.selectCluster(cluster)
  }

  renderEmpty() {
    return (
      <EmptyList
        icon="cluster"
        title={t('No Available Cluster')}
        desc={t('WORKSPACE_NO_CLUSTER_TIP')}
      />
    )
  }

  render() {
    return (
      <div>
        {!globals.app.isMultiCluster && (
          <ResourceStatistics workspace={this.workspace} />
        )}
        {this.props.workspaceStore.clusters.data.length > 0 ? (
          <>
            <PhysicalResource
              workspace={this.workspace}
              {...this.clusterProps}
            />
            <VirtualResource
              workspace={this.workspace}
              {...this.clusterProps}
            />
          </>
        ) : (
          this.renderEmpty()
        )}
      </div>
    )
  }
}

export default ResourceUsage
