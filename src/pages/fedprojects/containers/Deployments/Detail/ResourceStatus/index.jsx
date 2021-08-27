import React from 'react'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import { isEmpty, flatten, uniqBy, keyBy } from 'lodash'

import PodsCard from 'components/Cards/Pods'
import ContainerPortsCard from 'components/Cards/Containers/Ports'
import ClusterWorkloadStatus from 'fedprojects/components/ClusterWorkloadStatus'

import styles from './index.scss'

class ResourceStatus extends React.Component {
  get module() {
    return this.props.detailStore.module
  }

  get store() {
    return this.props.detailStore
  }

  get prefix() {
    const { workspace } = this.props.match.params
    return workspace ? `/${workspace}` : ''
  }

  get enabledActions() {
    return globals.app.getActions({
      module: this.module,
      project: this.props.match.params.namespace,
    })
  }

  renderReplicaInfo() {
    const { detail = {}, resources, isResourcesLoading } = this.store
    const clustersDetail = keyBy(
      this.props.projectStore.detail.clusters,
      'name'
    )

    return (
      <ClusterWorkloadStatus
        module={this.module}
        store={this.store}
        detail={detail}
        resources={resources}
        clustersDetail={clustersDetail}
        clusters={detail.clusters}
        isLoading={isResourcesLoading}
        canEdit={this.enabledActions.includes('edit')}
      />
    )
  }

  renderContainerPorts() {
    const { noPorts } = this.props

    if (noPorts) {
      return null
    }

    const { resources, isResourcesLoading } = this.store
    const ports = []
    Object.values(resources).forEach(resource => {
      if (resource && resource.containers) {
        ports.push(
          ...uniqBy(
            flatten(
              resource.containers.map(container =>
                isEmpty(container.ports) ? [] : container.ports.slice()
              )
            ),
            'name'
          ).map(item => ({ ...item, cluster: resource.cluster }))
        )
      }
    })

    if (isEmpty(ports)) return null

    return (
      <ContainerPortsCard
        ports={ports}
        loading={isResourcesLoading}
        isFederated
      />
    )
  }

  renderPods() {
    const { detail, resources } = this.store
    const clustersMap = keyBy(this.props.projectStore.detail.clusters, 'name')
    const clusters = detail.clusters
      .filter(item => clustersMap[item.name])
      .map(item => item.name)

    return (
      <PodsCard
        prefix={this.prefix}
        details={toJS(resources)}
        clusters={clusters}
        isFederated
      />
    )
  }

  renderContent() {
    return (
      <div>
        {this.renderReplicaInfo()}
        {this.renderContainerPorts()}
        {this.renderPods()}
      </div>
    )
  }

  render() {
    return <div className={styles.main}>{this.renderContent()}</div>
  }
}

export default inject('projectStore', 'detailStore')(observer(ResourceStatus))
export const Component = ResourceStatus
