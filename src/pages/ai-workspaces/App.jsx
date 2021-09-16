import React, { Component } from 'react'
import { inject, observer, Provider } from 'mobx-react'
import { get, set, pick } from 'lodash'
import { Loading } from '@kube-design/components'

import { renderRoutes } from 'utils/router.config'

import WorkspaceStore from 'stores/workspace'

import routes from './routes'

@inject('rootStore')
@observer
class WorkspaceLayout extends Component {
  constructor(props) {
    super(props)

    this.store = new WorkspaceStore()

    this.init(props.match.params)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.workspace !== this.workspace) {
      this.init(this.props.match.params)
    }
  }

  async init(params) {
    this.store.initializing = true

    await Promise.all([
      this.store.fetchDetail(params),
      this.store.fetchClusters({ ...params, limit: -1 }),
      this.props.rootStore.getRules(params),
    ])

    if (globals.app.isMultiCluster) {
      set(
        globals.ksConfig,
        'devops',
        this.store.clusters.data.some(cluster => get(cluster, 'configz.devops'))
      )
    }

    globals.app.cacheHistory(this.props.match.url, {
      type: 'Workspace',
      ...pick(this.store.detail, ['name', 'aliasName']),
    })

    this.store.initializing = false
  }

  get workspace() {
    return this.props.match.params.workspace
  }

  render() {
    const { initializing } = this.store

    if (initializing) {
      return <Loading className="ks-page-loading" />
    }

    return (
      <Provider workspaceStore={this.store}>{renderRoutes(routes)}</Provider>
    )
  }
}

export default WorkspaceLayout
