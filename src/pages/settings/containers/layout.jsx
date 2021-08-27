import React, { Component } from 'react'

import { renderRoutes } from 'utils/router.config'

import { Nav } from 'components/Layout'
import { Icon } from '@kube-design/components'

import styles from './layout.scss'

class AccessLayout extends Component {
  render() {
    const { match, route, location } = this.props
    return (
      <>
        <div className="ks-page-side">
          <div className={styles.titleWrapper}>
            <div className={styles.icon}>
              <Icon name="cogwheel" size={40} type="light" />
            </div>
            <div className={styles.text}>
              <div className="h6">{t('Platform Settings')}</div>
              <p>{t('PLATFORM_SETTINGS_SELECTOR_DESC')}</p>
            </div>
          </div>
          <Nav
            className="ks-page-nav"
            navs={globals.app.getPlatformSettingsNavs()}
            location={location}
            match={match}
          />
        </div>
        <div className="ks-page-main">{renderRoutes(route.routes)}</div>
      </>
    )
  }
}

export default AccessLayout
