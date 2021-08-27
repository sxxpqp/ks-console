import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

import { renderRoutes } from 'utils/router.config'

// import { Nav } from 'components/Layout'
import Selector from 'clusters/components/Selector'

@inject('rootStore', 'clusterStore')
@observer
class ClusterLayout extends Component {
  get cluster() {
    return this.props.match.params.cluster
  }

  get routing() {
    return this.props.rootStore.routing
  }

  enterCluster = async cluster =>
    this.routing.push(`/clusters/${cluster}/overview`)

  render() {
    const { route } = this.props
    // const { match, route, location } = this.props
    const { detail } = this.props.clusterStore

    return (
      <div className="ks-page">
        <div className="ks-page-side">
          <Selector
            icon={detail.icon}
            value={this.cluster}
            onChange={this.enterCluster}
          />
          {/* <Nav
            className="ks-page-nav"
            navs={globals.app.getClusterNavs(this.cluster)}
            location={location}
            match={match}
            disabled={!detail.isReady}
          /> */}
        </div>
        <div className="ks-page-main">{renderRoutes(route.routes)}</div>
      </div>
    )
  }
}

export default ClusterLayout
