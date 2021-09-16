import React from 'react'
import PropTypes from 'prop-types'

import { trimEnd } from 'lodash'

import { Menu } from 'antd'
import {
  HomeOutlined,
  AppstoreAddOutlined,
  ClusterOutlined,
  HddOutlined,
  LockOutlined,
  ToolOutlined,
  SettingOutlined,
  DashboardOutlined,
} from '@ant-design/icons'
import Link from './Link'

const { SubMenu } = Menu

const icons = {
  HomeOutlined: <HomeOutlined />,
  AppstoreAddOutlined: <AppstoreAddOutlined />,
  ClusterOutlined: <ClusterOutlined />,
  HddOutlined: <HddOutlined />,
  DashboardOutlined: <DashboardOutlined />,
  LockOutlined: <LockOutlined />,
  ToolOutlined: <ToolOutlined />,
  SettingOutlined: <SettingOutlined />,
}

class Nav extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    navs: PropTypes.array.isRequired,
    prefix: PropTypes.string,
    checkSelect: PropTypes.func,
    onItemClick: PropTypes.func,
    innerRef: PropTypes.object,
  }

  static defaultProps = {
    className: '',
    prefix: '',
    checkSelect() {},
    onItemClick() {},
  }

  constructor(props) {
    super(props)

    this.state = {
      openedNav: this.getOpenedNav(),
      openKeys: [],
    }
  }

  get currentPath() {
    const {
      location: { pathname },
      match: { url },
    } = this.props

    const length = trimEnd(url, '/').length
    return pathname.slice(length + 1)
  }

  getOpenedNav() {
    let name = ''
    const { navs } = this.props
    const current = this.currentPath
    navs.forEach(nav => {
      nav.items.forEach(item => {
        if (
          item.children &&
          item.children.some(child => {
            if (child.name === current) {
              return true
            }
            if (child.tabs) {
              return child.tabs.some(tab => tab.name === current)
            }

            return false
          })
        ) {
          name = item.name
        }
      })
    })

    return name
  }

  handleItemOpen = name => {
    this.setState(({ openedNav }) => ({
      openedNav: openedNav === name ? '' : name,
    }))
  }

  getKeys = items => {
    let arr = []
    items.forEach(item => {
      arr.push(item.name)
      if (item.children) {
        arr = [...arr, ...this.getKeys(item.children)]
      }
    })
    return arr
  }

  render() {
    // const [openKeys, setOpenKeys] = React.useState([])
    const { openKeys } = this.state

    const { className, navs, innerRef, onItemClick, match } = this.props
    const allKeys = this.getKeys(navs[0].items)

    const onOpenChange = keys => {
      const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1)
      if (allKeys.indexOf(latestOpenKey) === -1) {
        this.setState({ openKeys: keys })
      } else {
        this.setState({ openKeys: latestOpenKey ? [latestOpenKey] : [] })
      }
    }
    const prefix = trimEnd(match.url, '/')

    const arr = navs.length > 0 ? navs[0] : []
    // console.log(arr)
    return (
      <Menu
        ref={innerRef}
        className={className}
        mode="inline"
        theme="dark"
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        onClick={onItemClick}
      >
        {arr.items.map(nav =>
          nav.children ? (
            <SubMenu key={nav.name} title={t(nav.title)} icon={icons[nav.icon]}>
              {nav.children.map(item => (
                <Menu.Item key={item.name}>
                  <Link
                    to={`${prefix}/${item.name}`}
                    link={item.link}
                    name={t(item.title)}
                    indent={!!item.link}
                  >
                    {t(item.title)}
                  </Link>
                </Menu.Item>
              ))}
            </SubMenu>
          ) : (
            <Menu.Item key={nav.name} icon={icons[nav.icon]}>
              <Link to={nav.link ? nav.link : `${prefix}/${nav.name}`}>
                {t(nav.title)}
              </Link>
            </Menu.Item>
          )
        )}
      </Menu>
    )
  }
}

export default Nav
