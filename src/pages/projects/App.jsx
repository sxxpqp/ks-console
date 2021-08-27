import React, { Component } from 'react'
import { inject, observer, Provider } from 'mobx-react'
import { Loading } from '@kube-design/components'
import { set, pick } from 'lodash'

import { renderRoutes } from 'utils/router.config'

import ProjectStore from 'stores/project'
import ClusterStore from 'stores/cluster'

import routes from './routes'

@inject('rootStore')
@observer
class ProjectLayout extends Component {
  constructor(props) {
    super(props)

    this.store = new ProjectStore()
    this.clusterStore = new ClusterStore()

    this.init(props.match.params)
  }

  componentDidUpdate(prevProps) {
    const { namespace, cluster } = prevProps.match.params
    if (this.project !== namespace || this.cluster !== cluster) {
      this.init(this.props.match.params)
    }
  }

  async init(params) {
    this.store.initializing = true

    await Promise.all([
      this.store.fetchDetail(params),
      this.clusterStore.fetchDetail({ name: params.cluster }),
      this.props.rootStore.getRules({
        workspace: params.workspace,
      }),
    ])

    if (!this.store.detail.name) {
      return this.props.rootStore.routing.push('/404')
    }

    await this.props.rootStore.getRules(params)

    set(
      globals,
      `clusterConfig.${params.cluster}`,
      this.clusterStore.detail.configz
    )

    globals.app.cacheHistory(this.props.match.url, {
      type: 'Project',
      ...pick(this.store.detail, ['name', 'aliasName']),
      cluster: pick(this.clusterStore.detail, [
        'name',
        'aliasName',
        'group',
        'provider',
      ]),
    })

    this.store.initializing = false
  }

  get project() {
    return this.props.match.params.namespace
  }

  get cluster() {
    return this.props.match.params.cluster
  }

  render() {
    const { initializing } = this.store

    if (initializing) {
      return <Loading className="ks-page-loading" />
    }

    return <Provider projectStore={this.store}>{renderRoutes(routes)}</Provider>
  }
}

export default ProjectLayout
