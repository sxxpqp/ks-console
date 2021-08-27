import React, { Component } from 'react'
import { inject, observer, Provider } from 'mobx-react'
import { Loading } from '@kube-design/components'
import { set, pick } from 'lodash'

import { renderRoutes } from 'utils/router.config'

import ProjectStore from 'stores/project'
import ClusterStore from 'stores/cluster'
import DevOpsStore from 'stores/devops'

import routes from './routes'

@inject('rootStore')
@observer
class ProjectLayout extends Component {
  constructor(props) {
    super(props)

    this.store = new ProjectStore()
    this.clusterStore = new ClusterStore()
    // 加入store
    this.devopsStore = new DevOpsStore()

    this.init(props.match.params)
  }

  get cluster() {
    return this.props.match.params.cluster
  }

  get devops() {
    return this.props.match.params.devops
  }

  get workspace() {
    return this.props.match.params.workspace
  }

  get project() {
    return this.props.match.params.namespace
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
    // const tmp = {
    //   ...omit(params, 'namespace'),
    //   devops: 'default5tmqc',
    // }
    // console.log(
    //   '🚀 ~ file: App.jsx ~ line 80 ~ ProjectLayout ~ init ~ tmp',
    //   tmp
    // )
    await this.props.rootStore.getRules(params)
    // await this.props.rootStore.getRules(tmp)
    // await this.props.rootStore.getRules(tmp)

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

  render() {
    const { initializing } = this.store

    if (initializing) {
      return <Loading className="ks-page-loading" />
    }

    return (
      <Provider projectStore={this.store} devopsStore={this.devopsStore}>
        {renderRoutes(routes)}
      </Provider>
    )
  }
}

export default ProjectLayout
