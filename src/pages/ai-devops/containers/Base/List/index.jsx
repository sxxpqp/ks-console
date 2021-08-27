import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Loading } from '@kube-design/components'

import { renderRoutes } from 'utils/router.config'
import { Nav } from 'components/Layout'
import Selector from 'projects/components/Selector'

import styles from './index.scss'

@inject('rootStore', 'devopsStore')
@observer
class DevOpsListLayout extends Component {
  get workspace() {
    return this.props.match.params.workspace
  }

  get cluster() {
    return this.props.match.params.cluster
  }

  get devops() {
    return this.props.match.params.devops
  }

  get routing() {
    return this.props.rootStore.routing
  }

  handleChange = url => this.routing.push(url)

  render() {
    const { match, route, location } = this.props
    const { initializing, detail } = this.props.devopsStore

    if (initializing) {
      return <Loading className={styles.loading} />
    }

    return (
      <div className="ks-page">
        <div className="ks-page-side">
          <Selector
            type="devops"
            title={t('DevOps Project')}
            detail={detail}
            onChange={this.handleChange}
            workspace={this.workspace}
            cluster={this.cluster}
          />
          <Nav
            className="ks-page-nav"
            navs={globals.app.getDevOpsNavs({
              devops: this.devops,
              cluster: this.cluster,
              workspace: this.workspace,
            })}
            location={location}
            match={match}
          />
        </div>

        <div className="ks-page-main">{renderRoutes(route.routes)}</div>
      </div>
    )
  }
}

export default DevOpsListLayout
