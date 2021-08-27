import React, { Component } from 'react'
import { inject, observer, Provider } from 'mobx-react'
import { Loading } from '@kube-design/components'

import { renderRoutes } from 'utils/router.config'
import PipelineStore from 'stores/devops/pipelines'
import routes from './routes'

@inject('rootStore', 'devopsStore')
@observer
export default class PipelinesLayout extends Component {
  constructor(props) {
    super(props)

    this.store = new PipelineStore()
    this.init(props.match.params)
  }

  async init(params) {
    this.store.initializing = true

    await Promise.all([
      this.props.devopsStore.fetchDetail(params),
      this.store.fetchDetail(params),
      this.props.rootStore.getRules({
        workspace: params.workspace,
      }),
    ])

    await this.props.rootStore.getRules({
      cluster: params.cluster,
      workspace: params.workspace,
      devops: params.devops,
    })

    this.store.initializing = false
  }

  render() {
    const { initializing } = this.store

    if (initializing) {
      return <Loading className="ks-page-loading" />
    }
    return (
      <Provider pipelineStore={this.store}>{renderRoutes(routes)}</Provider>
    )
  }
}
