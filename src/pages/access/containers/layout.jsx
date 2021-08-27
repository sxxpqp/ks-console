import React, { Component } from 'react'
import { get } from 'lodash'

import { renderRoutes, getIndexRoute } from 'utils/router.config'

import { Nav } from 'components/Layout'
import { Icon } from '@kube-design/components'

import styles from './layout.scss'

class AccessLayout extends Component {
  render() {
    const { match, route, location } = this.props
    const navs = globals.app.getAccessNavs()
    const indexPath = get(navs, '[0].items[0].name')

    return (
      <>
        <div className="ks-page-side">
          <div className={styles.titleWrapper}>
            <div className={styles.icon}>
              <Icon name="key" size={40} type="light" />
            </div>
            <div className={styles.text}>
              <div className="h6">{t('Access Control')}</div>
              <p>{t('Platform-level Access Control')}</p>
            </div>
          </div>
          <Nav
            className="ks-page-nav"
            navs={navs}
            location={location}
            match={match}
          />
        </div>
        <div className="ks-page-main">
          {renderRoutes([
            ...route.routes,
            getIndexRoute({
              path: route.path,
              to: `${route.path}/${indexPath}`,
              exact: true,
            }),
          ])}
        </div>
      </>
    )
  }
}

export default AccessLayout
