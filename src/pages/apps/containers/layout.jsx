import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Icon } from '@kube-design/components'

import { renderRoutes } from 'utils/router.config'
import { Nav } from 'components/Layout'

import styles from './layout.scss'

@inject('rootStore')
@observer
export default class AppsLayout extends Component {
  render() {
    const { match, route, location } = this.props

    return (
      <div className="ks-page-body">
        <div className="ks-page-side">
          <div className={styles.titleWrapper}>
            <div className={styles.icon}>
              <Icon name="openpitrix" size={40} type="light" />
            </div>
            <div className={styles.text}>
              <div className="h6">{t('App Store Management')}</div>
              <p>{t('Platform App Store Management')}</p>
            </div>
          </div>
          <Nav
            className="ks-page-nav"
            navs={globals.app.getManageAppNavs()}
            location={location}
            match={match}
          />
        </div>
        <div className="ks-page-main">{renderRoutes(route.routes)}</div>
      </div>
    )
  }
}
