import React from 'react'
import { observer, inject } from 'mobx-react'

import PodsCard from 'components/Cards/Pods'

import ServiceStore from 'stores/service'

@inject('detailStore')
@observer
export default class ServiceDetails extends React.Component {
  serviceStore = new ServiceStore()

  get module() {
    return this.props.module
  }

  get store() {
    return this.props.detailStore
  }

  componentDidMount() {
    this.serviceStore.fetchDetail(this.props.match.params)
  }

  render() {
    const { cluster } = this.props.match.params

    if (this.serviceStore.isLoading) {
      return null
    }

    return (
      <PodsCard
        detail={this.serviceStore.detail}
        prefix={`/clusters/${cluster}`}
      />
    )
  }
}
