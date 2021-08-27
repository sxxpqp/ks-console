import React from 'react'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import { isEmpty } from 'lodash'

import ContainersCard from 'components/Cards/Containers'
import VolumesCard from 'components/Cards/Volumes'

@inject('detailStore')
@observer
class PodsResourceStatus extends React.Component {
  get module() {
    return this.props.detailStore.module
  }

  get store() {
    return this.props.detailStore
  }

  get prefix() {
    return this.props.match.url
      .split('/')
      .slice(0, -1)
      .join('/')
  }

  renderContainers() {
    const { name, cluster, containers, initContainers } = toJS(
      this.store.detail
    )
    return (
      <ContainersCard
        prefix={this.prefix}
        cluster={cluster}
        title={t('Containers')}
        containers={containers}
        initContainers={initContainers}
        podName={name}
      />
    )
  }

  renderVolumes() {
    const { volumes, containers } = toJS(this.store.detail)

    if (isEmpty(volumes)) return null

    return (
      <VolumesCard
        title={t('Storage Device')}
        volumes={volumes}
        containers={containers}
        loading={this.store.isLoading}
        match={this.props.match}
      />
    )
  }

  renderContent() {
    return (
      <div>
        {this.renderContainers()}
        {this.renderVolumes()}
      </div>
    )
  }

  render() {
    return <div>{this.renderContent()}</div>
  }
}

export default PodsResourceStatus
