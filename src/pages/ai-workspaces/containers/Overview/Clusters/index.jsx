import React from 'react'
import { isEmpty } from 'lodash'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import EmptyList from 'components/Cards/EmptyList'

import ClusterMonitorStore from 'stores/monitoring/cluster'

import Card from './Card'

@inject('rootStore', 'workspaceStore')
@observer
class BaseInfo extends React.Component {
  monitorStore = new ClusterMonitorStore()

  state = {
    confirm: false,
    workspaces: {},
  }

  get store() {
    return this.props.workspaceStore
  }

  get module() {
    return 'BaseInfo'
  }

  get routing() {
    return this.props.rootStore.routing
  }

  get workspace() {
    return this.props.match.params.workspace
  }

  render() {
    if (!globals.app.isMultiCluster) {
      return null
    }

    const { data, isLoading } = toJS(this.store.clusters)
    if (isEmpty(data) && !isLoading) {
      return (
        <EmptyList
          icon="cluster"
          title={t('No Available Cluster')}
          desc={t('WORKSPACE_NO_CLUSTER_TIP')}
        />
      )
    }

    return data.map(cluster => <Card key={cluster.name} cluster={cluster} />)
  }
}

export default BaseInfo
