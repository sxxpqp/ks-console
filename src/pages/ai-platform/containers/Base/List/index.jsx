import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { get } from 'lodash'

import { renderRoutes } from 'utils/router.config'
import { Nav, Header } from 'components/Layout'
import { Layout } from 'antd'
import { Link } from 'react-router-dom'

import styles from './index.scss'

const { Header: OuterHeader, Sider, Content } = Layout
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

  handleJumpTo = link => {
    this.props.rootStore.routing.push(link)
  }

  render() {
    const { match, location, rootStore } = this.props
    const { workspace, cluster, namespace } = match.params
    // const { detail } = this.props.projectStore

    // 获取全局的导航配置 -> yaml文件中
    const navs = globals.app.getProjectNavs({
      cluster,
      workspace,
      project: namespace,
    })
    // console.log(
    //   '🚀 ~ file: index.jsx ~ line 55 ~ ProjectLayout ~ render ~ navs',
    //   navs
    // )
    // const logo = globals.config.logo || '/assets/logo.svg'

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider width={220}>
          <Link to={'/'}>
            {/* <img className={styles.logo} src={logo} alt="" /> */}
            <span className={styles.mytitle}>
              {globals.config.title || t('PLATFORM_TITLE')}
            </span>
          </Link>
          <Nav
            className="ks-page-nav"
            navs={navs}
            location={location}
            match={match}
            rootStore={rootStore}
          />
        </Sider>
        <Layout style={{ overflow: 'hidden', height: '100vh' }}>
          <OuterHeader
            className="site-layout-background"
            style={{ padding: 0 }}
          >
            <Header
              innerRef={this.headerRef}
              location={location}
              onToggleNav={rootStore.toggleGlobalNav}
              jumpTo={this.handleJumpTo}
            />
          </OuterHeader>
          <Content
            style={{
              padding: '10px 20px',
              overflowX: 'hidden',
            }}
          >
            {renderRoutes(this.getRoutes(navs))}
          </Content>
        </Layout>
      </Layout>
    )
  }
}

export default ProjectLayout
