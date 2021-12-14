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

  get routing() {
    return this.props.rootStore.routing
  }

  constructor(props) {
    super(props)

    this.state = {
      // openedNav: this.getOpenedNav(),
      openKeys: [],
      selectedKeys: [],
      names: {},
      collapse: false,
    }

    // const { navs } = this.props
    // const navData = navs.length > 0 ? navs[0].items : []
    this.navData.forEach(nav => {
      this.state.names = {
        ...this.state.names,
        [nav.name]:
          nav.children && nav.children.length > 0
            ? nav.children.map(item => item.name)
            : nav.name,
      }
    })
    // this.setState({ navData })
  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    })
  }

  componentDidMount() {
    this.unsubscribe = this.routing.history.subscribe(location => {
      const { state } = location
      // debugger
      // if (state) {
      // eslint-disable-next-line no-console
      let name = state?.name || this.getCurrentPath(location.pathname)
      if (name.indexOf('/') !== -1) {
        name = name.split('/')[0]
      }
      this.setState({
        selectedKeys: this.getNavName(name),
        openKeys: this.getOpenedNav(name),
      })
      //   this.props.rootStore.saveSelectNavKey(name)
      // } else {
      //   const name = this.props.rootStore.selectNavKey
      //   this.setState({
      //     selectedKeys: [name],
      //     openKeys: this.getOpenedNav(name),
      //   })
      // }
    })
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }

  getCurrentPath(path) {
    const {
      match: { url },
    } = this.props
    const length = trimEnd(url, '/').length
    return path.slice(length + 1) || 'home'
  }

  get currentPath() {
    const {
      location: { pathname },
      match: { url },
    } = this.props

    const length = trimEnd(url, '/').length
    return pathname.slice(length + 1) || 'home'
  }

  get navData() {
    const { navs } = this.props
    return navs.length > 0 ? navs[0].items : []
  }

  getNavName(path) {
    let name = ''
    for (let t = 0; t < this.navData.length; t++) {
      const nav = this.navData[t]
      if (nav.name === path) {
        name = nav.name
        break
      }
      if (nav.children && nav.children.length) {
        for (let j = 0; j < nav.children.length; j++) {
          const item = nav.children[j]
          if (item.name === path) {
            name = item.name
            break
          }
          if (item.tabs && item.tabs.length) {
            for (let i = 0; i < item.tabs.length; i++) {
              const tab = item.tabs[i]
              if (tab.name === path) {
                name = item.name
                break
              }
            }
          }
        }
      }
    }
    return [name]
  }

  getOpenedNav(path) {
    let results = []
    for (let t = 0; t < this.navData.length; t++) {
      const nav = this.navData[t]
      const name = nav.name
      if (name === path) {
        results = [name]
        break
      }
      if (nav.children && nav.children.length) {
        for (let j = 0; j < nav.children.length; j++) {
          const item = nav.children[j]
          if (item.name === path) {
            results = [nav.name]
            break
          }
          if (item.tabs && item.tabs.length) {
            for (let i = 0; i < item.tabs.length; i++) {
              const tab = item.tabs[i]
              if (tab.name === path) {
                results = [nav.name]
                break
              }
            }
          }
        }
      }
    }
    return results
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
    const { openKeys, selectedKeys } = this.state

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
    const onSelectChange = ({ selectedKeys: key }) => {
      this.setState({ selectedKeys: key })
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
        selectedKeys={selectedKeys}
        onOpenChange={onOpenChange}
        onClick={onItemClick}
        onSelect={onSelectChange}
      >
        {arr.items.map(nav => {
          return nav.children ? (
            <SubMenu key={nav.name} title={t(nav.title)} icon={icons[nav.icon]}>
              {nav.children.map(item => (
                <Menu.Item key={item.name}>
                  <Link
                    to={{
                      pathname: `${prefix}/${item.name}`,
                      state: { name: item.name },
                    }}
                    link={item.link}
                    name={t(item.title)}
                    indent={(!!item.link).toString()}
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
        })}
      </Menu>
    )
  }
}

export default Nav
