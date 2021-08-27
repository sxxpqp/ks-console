import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

import { renderRoutes } from 'utils/router.config'
import { Nav } from 'components/Layout'
import Selector from 'projects/components/Selector'

@inject('rootStore', 'projectStore')
@observer
export default class FederatedProjectLayout extends Component {
  get project() {
    return this.props.match.params.namespace
  }

  get routing() {
    return this.props.rootStore.routing
  }

  handleChange = url => this.routing.push(url)

  render() {
    const { match, route, location } = this.props
    const { detail } = this.props.projectStore

    return (
      <div className="ks-page">
        <div className="ks-page-side">
          <Selector
            title={t('Multi-cluster Projects')}
            type="federatedprojects"
            detail={detail}
            workspace={match.params.workspace}
            onChange={this.handleChange}
            isFederated
          />
          <Nav
            className="ks-page-nav"
            navs={globals.app.getFederatedProjectNavs()}
            location={location}
            match={match}
          />
        </div>
        <div className="ks-page-main">{renderRoutes(route.routes)}</div>
      </div>
    )
  }
}
