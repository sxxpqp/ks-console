import { inject } from 'mobx-react'
import { withRouter } from 'react-router-dom'
import { Component as Base } from 'core/containers/Base/Detail'

@withRouter
@inject('rootStore', 'projectStore')
export default class DetailPage extends Base {
  get enabledActions() {
    const { cluster, namespace } = this.props.match.params
    return globals.app.getActions({
      module: this.authKey,
      project: namespace,
      cluster,
    })
  }

  async init() {
    this.setState({ initializing: false })
  }
}
