import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { LocaleProvider, Loading, Notify } from '@kube-design/components'

import { isAppsPage, isMemberClusterPage } from 'utils'
import request from 'utils/request'

import App from './App'
import GlobalValue from './global'
import i18n from './i18n'
import 'antd/dist/antd.less'

// 导入中文包
require('dayjs/locale/zh-cn')
require('@babel/polyfill')

window.note = Notify

// request error handler
window.onunhandledrejection = function(e) {
  if (e && (e.status === 'Failure' || e.status >= 400)) {
    if (e.status === 401 || e.reason === 'Unauthorized') {
      // session timeout handler, except app store page.
      if (!isAppsPage() && !isMemberClusterPage(location.pathname, e.message)) {
        /* eslint-disable no-alert */
        location.href = `/login?referer=${location.pathname}`
        window.alert(
          t(
            'Session timeout or this account is logged in elsewhere, please login again'
          )
        )
      } else {
        Notify.error({ title: e.reason, content: t(e.message), duration: 6000 })
      }
    } else if (globals.config.enableErrorNotify && (e.reason || e.message)) {
      Notify.error({ title: e.reason, content: t(e.message), duration: 6000 })
    }
  }
}

// 全局注册t，国际化
window.t = i18n.t
// 全局注册request
window.request = request

globals.app = new GlobalValue()

const render = async component => {
  const { locales } = await i18n.init()
  ReactDOM.render(
    <Suspense fallback={<Loading className="ks-page-loading" />}>
      <LocaleProvider locales={locales} localeKey="lang" ignoreWarnings>
        {component}
      </LocaleProvider>
    </Suspense>,
    document.getElementById('root')
  )
}

render(<App />)

module.hot &&
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default
    render(<NextApp />)
  })
