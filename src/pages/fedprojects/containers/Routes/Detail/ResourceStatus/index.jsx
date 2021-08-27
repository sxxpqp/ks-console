import React from 'react'
import { keyBy } from 'lodash'
import { observer, inject } from 'mobx-react'
import { Loading } from '@kube-design/components'

import Item from './Item'

@inject('detailStore', 'projectStore')
@observer
export default class ResourceStatus extends React.Component {
  store = this.props.detailStore

  render() {
    const { detail, resources = {}, isResourcesLoading } = this.store
    const clusters = keyBy(this.props.projectStore.detail.clusters, 'name')
    return (
      <Loading spinning={isResourcesLoading}>
        <div>
          {detail.clusters.map(cluster => (
            <Item
              key={cluster.name}
              {...this.props.match.params}
              detail={resources[cluster.name]}
              cluster={clusters[cluster.name]}
            />
          ))}
        </div>
      </Loading>
    )
  }
}
