import React, { Component } from 'react'
import { inject, observer, Provider } from 'mobx-react'
import { set, pick } from 'lodash'

import { Loading } from '@kube-design/components'

import { renderRoutes } from 'utils/router.config'

import ClusterStore from 'stores/cluster'

@inject('rootStore')
@observer
export default class App extends Component {
  constructor(props) {
    super(props)

    this.store = new ClusterStore()
  }

  componentDidMount() {
    this.init(this.props.match.params)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.cluster !== this.cluster) {
      this.init(this.props.match.params)
    }
  }

  async init(params) {
    this.store.initializing = true

    if (params.cluster) {
      await Promise.all([
        this.store.fetchDetail({ name: params.cluster }),
        this.props.rootStore.getRules({ cluster: params.cluster }),
      ])

      if (this.store.detail.isReady) {
        await this.store.fetchProjects({ cluster: params.cluster })
      }

      set(globals, `clusterConfig.${params.cluster}`, this.store.detail.configz)

      globals.app.cacheHistory(this.props.match.url, {
        type: 'Cluster',
        ...pick(this.store.detail, ['name', 'aliasName', 'group', 'isHost']),
      })
    }

    this.store.initializing = false
  }

  get cluster() {
    return this.props.match.params.cluster
  }

  render() {
    const { initializing } = this.store

    if (initializing) {
      return <Loading className="ks-page-loading" />
    }

    return (
      <Provider clusterStore={this.store}>
        {renderRoutes(this.props.route.routes)}
      </Provider>
    )
  }
}
