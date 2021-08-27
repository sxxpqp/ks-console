import React from 'react'
import { observer, inject } from 'mobx-react'
import { get } from 'lodash'

import { Component as Base } from 'fedprojects/containers/Deployments/Detail/ResourceStatus'
import FederatedStore from 'stores/federated'

import ServiceCard from './ServiceCard'

@inject('projectStore', 'detailStore')
@observer
class ResourceStatus extends Base {
  serviceStore = new FederatedStore({ module: 'services' })

  componentDidMount() {
    this.fetchService()
  }

  fetchService = async () => {
    const { namespace, template } = this.store.detail
    const name = get(template, 'spec.serviceName', '')
    const result = await this.serviceStore.checkName({ name, namespace })
    if (result.exist) {
      await this.serviceStore.fetchDetail({ name, namespace })
    }
  }

  renderServices() {
    const { detail, isLoading } = this.serviceStore
    const { workspace } = this.props.match.params

    if (!detail.name) return null

    return (
      <ServiceCard service={detail} workspace={workspace} loading={isLoading} />
    )
  }

  renderContent() {
    return (
      <div>
        {this.renderReplicaInfo()}
        {this.renderServices()}
        {this.renderContainerPorts()}
        {this.renderPods()}
      </div>
    )
  }
}

export default ResourceStatus
