import { Icon, Menu } from '@kube-design/components'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'
import { isAppsPage } from 'utils'
import LoginInfo from '../LoginInfo'
import styles from './index.scss'

class Header extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    innerRef: PropTypes.object,
    jumpTo: PropTypes.func,
  }

  get isLoggedIn() {
    return Boolean(globals.user)
  }

  handleLinkClick = link => () => {
    this.props.jumpTo(link)
  }

  handleDocumentLinkClick = (e, key) => {
    window.open(key)
  }

  renderDocumentList() {
    return (
      <Menu onClick={this.handleDocumentLinkClick} data-test="header-docs">
        <Menu.MenuItem key={globals.config.documents.url}>
          <Icon name="hammer" /> {t('User Manual')}
        </Menu.MenuItem>
        <Menu.MenuItem key={globals.config.documents.api}>
          <Icon name="api" /> {t('API Documents')}
        </Menu.MenuItem>
      </Menu>
    )
  }

  render() {
    const { className, innerRef } = this.props
    const logo = globals.config.logo || '/assets/logo.svg'

    return (
      <div
        ref={innerRef}
        className={classnames(
          styles.header,
          {
            [styles.inAppsPage]: isAppsPage(),
          },
          className
        )}
      >
        <Link to={isAppsPage() && !globals.user ? '/apps' : '/'}>
          <img
            className={styles.logo}
            src={isAppsPage() ? `/assets/login-logo.svg` : logo}
            alt=""
          />
          <span className={styles.mytitle}>{t('PLATFORM_TITLE')}</span>
        </Link>
        <div className="header-bottom" />
        {/* {this.isLoggedIn && (
          <div className={styles.navs}>
            {globals.app.enableGlobalNav && (
              <Button
                type="flat"
                icon="cogwheel"
                onClick={this.props.onToggleNav}
              >
                {t('Platform')}
              </Button>
            )}
            {globals.app.enableAppStore && (
              <Button
                type="flat"
                icon="appcenter"
                onClick={this.handleLinkClick('/apps')}
                className={classnames({
                  [styles.active]: location.pathname === '/apps',
                })}
              >
                {t('App Store')}
              </Button>
            )}
            <Button
              type="flat"
              icon="dashboard"
              onClick={this.handleLinkClick('/')}
              className={classnames({
                [styles.active]: location.pathname === '/',
              })}
            >
              {t('Workbench')}
            </Button>
          </div>
        )} */}
        <div className={styles.right}>
          {/* {this.isLoggedIn && (
            <Dropdown content={this.renderDocumentList()}>
              <Button type="flat" icon="documentation" />
            </Dropdown>
          )} */}
          <LoginInfo className={styles.loginInfo} isAppsPage={isAppsPage()} />
        </div>
      </div>
    )
  }
}

export default Header
