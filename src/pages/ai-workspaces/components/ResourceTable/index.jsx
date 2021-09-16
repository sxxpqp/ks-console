import React from 'react'
import { isEmpty } from 'lodash'

import BaseTable from 'components/Tables/Base'
import EmptyList from 'components/Cards/EmptyList'
import withTableActions from 'components/HOCs/withTableActions'

import ClusterSelect from './ClusterSelect'

class ResourceTable extends React.Component {
  renderCustomFilter() {
    const { showClusterSelect, clusters, cluster, onClusterChange } = this.props

    if (!showClusterSelect) {
      return null
    }

    return (
      <ClusterSelect
        clusters={clusters}
        cluster={cluster}
        onChange={onClusterChange}
      />
    )
  }

  render() {
    const { clusters } = this.props
    if (globals.app.isMultiCluster && isEmpty(clusters)) {
      return (
        <EmptyList
          icon="cluster"
          title={t('No Available Cluster')}
          desc={t('WORKSPACE_NO_CLUSTER_TIP')}
        />
      )
    }

    return (
      <BaseTable customFilter={this.renderCustomFilter()} {...this.props} />
    )
  }
}

export default withTableActions(ResourceTable)
