import React from 'react'
import { observer, inject } from 'mobx-react'
import { get } from 'lodash'

import { Component as Base } from 'projects/containers/Deployments/Detail/ResourceStatus'
import ResourceStore from 'stores/workload/resource'

import ServiceCard from './ServiceCard'

@inject('detailStore')
@observer
class ResourceStatus extends Base {
  resourceStore = new ResourceStore()

  get serviceName() {
    return get(this.store.detail, 'spec.serviceName', '')
  }

  fetchData = async () => {
    const { cluster, namespace } = this.store.detail
    const params = {
      name: this.serviceName,
      cluster,
      namespace,
    }

    await this.resourceStore.checkService(params)

    if (this.resourceStore.isExistService) {
      await this.resourceStore.fetchService(params)
    }
  }

  renderServices() {
    const { service, isLoading } = this.resourceStore

    if (!service.name) return null

    return (
      <ServiceCard prefix={this.prefix} service={service} loading={isLoading} />
    )
  }

  renderContent() {
    return (
      <div>
        {this.renderPlacement()}
        {this.renderReplicaInfo()}
        {this.renderServices()}
        {this.renderContainerPorts()}
        {this.renderPods()}
      </div>
    )
  }
}

export default ResourceStatus
