import { withRouter } from 'react-router-dom'
import { inject } from 'mobx-react'
import { Component as Base } from 'core/containers/Base/Detail'

@withRouter
@inject('rootStore')
export default class DetailPage extends Base {
  get enabledActions() {
    const { cluster, namespace: project } = this.props.match.params
    return globals.app.getActions({
      module: this.authKey,
      cluster,
      project,
    })
  }
}
