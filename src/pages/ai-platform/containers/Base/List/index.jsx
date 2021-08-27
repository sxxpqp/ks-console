import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { get } from 'lodash'

import { renderRoutes } from 'utils/router.config'
import { Nav } from 'components/Layout'
// import Selector from 'projects/components/Selector'

@inject('rootStore', 'projectStore')
@observer
class ProjectLayout extends Component {
  getRoutes(navs) {
    const { routes, path } = this.props.route
    const nav = get(navs, '[0].items[0]', {})
    // debugger
    const name = get(nav.children, '[0].name') || nav.name

    if (!name) {
      return []
    }

    if (routes) {
      routes.forEach(route => {
        if (route.path === path && route.redirect) {
          route.redirect.to = `${path}/${name}`
        }
      })
    }
    return routes
  }

  handleChange = url => this.props.rootStore.routing.push(url)

  render() {
    const { match, location } = this.props
    const { workspace, cluster, namespace } = match.params
    // const { detail } = this.props.projectStore

    // 获取全局的导航配置 -> yaml文件中
    const navs = globals.app.getProjectNavs({
      cluster,
      workspace,
      project: namespace,
    })

    return (
      <div className="ks-page">
        <div className="ks-page-side">
          {/* 关闭Select显示 */}
          {/* <Selector
            title={t('Projects')}
            detail={detail}
            onChange={this.handleChange}
          /> */}
          <Nav
            className="ks-page-nav"
            navs={navs}
            location={location}
            match={match}
          />
        </div>
        <div className="ks-page-main">{renderRoutes(this.getRoutes(navs))}</div>
      </div>
    )
  }
}

export default ProjectLayout
