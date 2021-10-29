import { has, isString } from 'lodash'
import React from 'react'
import { NavLink, withRouter } from 'react-router-dom'
import { inject, Provider } from 'mobx-react'
import pathToRegexp from 'path-to-regexp'

import { ICON_TYPES } from 'utils/constants'
import { renderRoutes } from 'utils/router.config'

import BaseInfo from './BaseInfo'

import styles from './index.scss'

class DetailPage extends React.Component {
  constructor(props) {
    super(props)
    this.stores = {}

    this.state = {
      routes: this.getEnabledRoutes(),
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.routes !== this.props.routes) {
      this.setState({ routes: this.getEnabledRoutes() })
    }
  }

  get authKey() {
    return this.props.authKey || this.props.module
  }

  getEnabledRoutes() {
    const { routes } = this.props
    const { cluster } = this.props.match.params
    return routes.filter(item => {
      if (item.ksModule) {
        const modules = isString(item.ksModule)
          ? [item.ksModule]
          : item.ksModule
        return modules.every(module => globals.app.hasKSModule(module))
      }
      if (item.clusterModule) {
        const modules = isString(item.clusterModule)
          ? [item.clusterModule]
          : item.clusterModule

        return modules.every(module =>
          globals.app.hasClusterModule(cluster, module)
        )
      }
      return true
    })
  }

  get enabledActions() {
    const { namespace: project, ...rest } = this.props.match.params
    return globals.app.getActions({
      module: this.authKey,
      ...rest,
      project,
    })
  }

  getEnabledOperations = () => {
    const { operations = [] } = this.props
    return operations.filter(item => {
      if (has(item, 'show') && !item.show) {
        return false
      }
      return !item.action || this.enabledActions.includes(item.action)
    })
  }

  renderNav(routes) {
    const { params } = this.props.match

    return (
      <div className={styles.nav}>
        {routes.map(route => {
          if (!route.title) {
            return null
          }

          return (
            <NavLink
              key={route.path}
              className={styles.navItem}
              activeClassName={styles.active}
              to={pathToRegexp.compile(route.path)(params)}
            >
              {t(route.title)}
            </NavLink>
          )
        })}
      </div>
    )
  }

  render() {
    const { stores, nav, ...sideProps } = this.props
    const { state } = this.props.location
    if (state && state.prevPath) {
      localStorage.setItem('prevPath', state.prevPath)
    }
    const { routes } = this.state
    return (
      <Provider {...this.stores} {...stores}>
        <>
          <div className={styles.sider}>
            <BaseInfo
              {...sideProps}
              icon={sideProps.icon || ICON_TYPES[sideProps.module]}
              operations={this.getEnabledOperations()}
            />
          </div>
          <div className={styles.content}>
            {nav || this.renderNav(routes)}
            {renderRoutes(routes)}
          </div>
        </>
      </Provider>
    )
  }
}

export default inject('rootStore')(withRouter(DetailPage))
export const Component = DetailPage
