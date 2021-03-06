import React, { Component } from 'react'
import { Router } from 'react-router'
import { createBrowserHistory } from 'history'
import { Provider } from 'mobx-react'
import { syncHistoryWithStore } from 'mobx-react-router'
import { renderRoutes } from 'utils/router.config'
import { lazy } from 'utils'

import RootStore from 'stores/root'
// 自定义的全局store
import HomeStore from 'stores/ai-platform/home'
import { ConfigProvider } from 'antd'

import '@kube-design/components/esm/styles/index.scss'
import 'scss/main.scss'

import zhCN from 'antd/lib/locale/zh_CN'

import routes from './routes'

const getActions = lazy(() =>
  import(/* webpackChunkName: "actions" */ 'actions')
)

class App extends Component {
  constructor(props) {
    super(props)

    this.rootStore = new RootStore()
    // 自定义的全局store
    this.homeStore = new HomeStore()
    this.history = syncHistoryWithStore(
      createBrowserHistory(),
      this.rootStore.routing
    )
  }

  componentDidMount() {
    getActions().then(actions =>
      this.rootStore.registerActions(actions.default)
    )
  }

  render() {
    return (
      <Provider rootStore={this.rootStore} homeStore={this.homeStore}>
        <ConfigProvider locale={zhCN}>
          <Router history={this.history}>{renderRoutes(routes)}</Router>
        </ConfigProvider>
      </Provider>
    )
  }
}

export default App
