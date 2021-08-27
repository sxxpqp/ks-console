import React from 'react'
import { observer, inject } from 'mobx-react'
import { Component as Base } from 'projects/containers/Deployments/Detail/ResourceStatus'
import PodsCard from 'components/Cards/Pods'
import { Loading } from '@kube-design/components'

@inject('detailStore', 's2iRunStore')
@observer
class JobsResourceStatus extends Base {
  get store() {
    return this.props.s2iRunStore
  }

  renderPods() {
    const { workspace, cluster } = this.props.match.params

    return (
      <PodsCard
        prefix={`/${workspace ? `/${workspace}` : ''}/clusters/${cluster}`}
        detail={{ cluster, ...this.store.jobDetail }}
      />
    )
  }

  renderContent() {
    const { isLoading } = this.store

    if (isLoading) {
      return <Loading />
    }
    return (
      <div>
        {this.renderContainerPorts()}
        {this.renderPods()}
      </div>
    )
  }
}

export default JobsResourceStatus
