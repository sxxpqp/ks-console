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

    const { navs } = this.props
    const navData = navs.length > 0 ? navs[0].items : []
    navData.forEach(nav => {
      this.state.names = {
        ...this.state.names,
        [nav.name]:
          nav.children && nav.children.length > 0
            ? nav.children.map(item => item.name)
            : nav.name,
      }
    })
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
      if (state) {
        // eslint-disable-next-line no-console
        this.setState({
          selectedKeys: [state.name],
          openKeys: this.getOpenedNav(state.name),
        })
        this.props.rootStore.saveSelectNavKey(state.name)
      } else {
        const name = this.props.rootStore.selectNavKey
        this.setState({
          selectedKeys: [name],
          openKeys: this.getOpenedNav(name),
        })
      }
    })
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }

  get currentPath() {
    const {
      location: { pathname },
      match: { url },
    } = this.props

    const length = trimEnd(url, '/').length
    return pathname.slice(length + 1)
  }

  getNavName(path) {
    // debugger
    let name = ''
    const { match } = this.props
    const { names } = this.state
    const prefix = trimEnd(match.url, '/')
    Object.keys(names).forEach(key => {
      if (names[key] instanceof Array) {
        name = names[key].filter(
          p => path.indexOf(`${prefix}/${p.name}`) !== -1
        )[0]
      } else if (path.indexOf(names[key]) !== -1) {
        name = names[key]
      }
    })
    return name
  }

  getOpenedNav(path) {
    let results = []
    const { names } = this.state
    Object.keys(names).forEach(key => {
      if (
        names[key] instanceof Array
          ? names[key].some(p => p === path)
          : path === names[key]
      ) {
        results = [key]
      }
    })
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
        })}
      </Menu>
    )
  }
}

export default Nav
