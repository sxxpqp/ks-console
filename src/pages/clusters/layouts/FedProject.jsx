import React, { Component } from 'react'
import { inject, observer, Provider } from 'mobx-react'

import { toJS } from 'mobx'
import { Loading } from '@kube-design/components'

import { renderRoutes } from 'utils/router.config'

import FederatedStore from 'stores/federated'
import ClusterStore from 'stores/cluster'

@inject('rootStore')
@observer
export default class App extends Component {
  constructor(props) {
    super(props)

    this.store = new FederatedStore({ module: 'namespaces' })

    this.clusterStore = new ClusterStore()

    this.init(props.match.params)
  }

  async init(params) {
    this.store.initializing = true
    await Promise.all([
      this.store.fetchDetail({ ...params, name: params.namespace }),
      this.props.rootStore.getRules(params),
    ])
    await this.clusterStore.fetchList({
      names: this.store.detail.clusters.map(item => item.name).join(','),
      sortBy: 'createTime',
      ascending: true,
    })
    this.store.detail.clusters = toJS(this.clusterStore.list.data)

    this.store.initializing = false
  }

  get project() {
    return this.props.match.params.namespace
  }

  render() {
    const { initializing } = this.store

    if (initializing) {
      return <Loading className="ks-page-loading" />
    }

    return (
      <Provider projectStore={this.store}>
        {renderRoutes(this.props.route.routes)}
      </Provider>
    )
  }
}
