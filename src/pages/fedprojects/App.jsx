import React, { Component } from 'react'
import { set } from 'lodash'
import { toJS } from 'mobx'
import { inject, observer, Provider } from 'mobx-react'

import { Loading } from '@kube-design/components'

import { renderRoutes } from 'utils/router.config'

import FederatedStore from 'stores/federated'
import ClusterStore from 'stores/cluster'

import routes from './routes'

@inject('rootStore')
@observer
export default class App extends Component {
  constructor(props) {
    super(props)

    this.store = new FederatedStore({ module: 'namespaces' })

    this.clusterStore = new ClusterStore()

    this.init(props.match.params)
  }

  componentDidUpdate(prevProps) {
    if (this.project !== prevProps.match.params.namespace) {
      this.init(this.props.match.params)
    }
  }

  async init(params) {
    this.store.initializing = true

    await Promise.all([
      this.store.fetchDetail({ ...params, name: params.namespace }),
      this.props.rootStore.getRules({ workspace: params.workspace }),
    ])
    await this.props.rootStore.getRules(params)

    await this.clusterStore.fetchList({
      names: this.store.detail.clusters.map(item => item.name).join(','),
      sortBy: 'createTime',
      ascending: true,
      limit: -1,
    })
    this.store.detail.clusters = toJS(this.clusterStore.list.data)

    this.store.detail.clusters.forEach(cluster => {
      set(globals, `clusterConfig.${cluster.name}`, cluster.configz)
    })

    await this.props.rootStore.getRules(params)

    globals.app.cacheHistory(this.props.match.url, {
      type: 'Multi-cluster Project',
      name: this.store.detail.name,
      aliasName: this.store.detail.aliasName,
      isFedManaged: true,
    })

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

    return <Provider projectStore={this.store}>{renderRoutes(routes)}</Provider>
  }
}
