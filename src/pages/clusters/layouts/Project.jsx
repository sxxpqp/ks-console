import React, { Component } from 'react'
import { inject, observer, Provider } from 'mobx-react'
import { Loading } from '@kube-design/components'

import { renderRoutes } from 'utils/router.config'

import ProjectStore from 'stores/project'

@inject('rootStore')
@observer
class ProjectLayout extends Component {
  constructor(props) {
    super(props)

    this.store = new ProjectStore()

    this.init(props.match.params)
  }

  async init(params) {
    this.store.initializing = true

    await Promise.all([
      this.store.fetchDetail(params),
      this.props.rootStore.getRules(params),
    ])

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

export default ProjectLayout
