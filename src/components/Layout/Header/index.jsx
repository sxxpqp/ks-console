/* eslint-disable no-unused-vars */
import { Icon, Menu, Button } from '@kube-design/components'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
// import { Link } from 'react-router-dom'
import { isAppsPage } from 'utils'
// import dayjs from 'dayjs'
import LoginInfo from '../LoginInfo'
import styles from './index.scss'

class Header extends React.Component {
  // constructor(props) {
  //   super(props)
  //   this.state = {
  //     time: dayjs()
  //       .locale('zh-cn')
  //       .format('YYYY-MM-DD HH:mm:ss dddd'),
  //     timer: null,
  //   }
  // }

  componentDidMount() {
    // const ctrl = setInterval(() => {
    //   this.setState({
    //     time: dayjs()
    //       .locale('zh-cn')
    //       .format('YYYY-MM-DD HH:mm:ss dddd'),
    //   })
    // }, 1000)
    // this.setState({
    //   timer: ctrl,
    // })
  }

  componentWillUnmount() {
    // clearInterval(this.state.timer)
  }

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
    // const { time } = this.state

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
        <div className="header-bottom" />
        <div>
          {/* // todo */}
          {/* <Button type="flat" icon="hammer" onClick={e => {}}>
            创建工单
          </Button> */}
          <Button
            type="flat"
            icon="appcenter"
            onClick={e =>
              this.handleDocumentLinkClick(e, globals.config.url.help)
            }
          >
            帮助文档
          </Button>
        </div>
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
