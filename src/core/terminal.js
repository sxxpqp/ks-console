import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { LocaleProvider, Loading, Notify } from '@kube-design/components'

import request from 'utils/request'

import TerminalApp from 'pages/terminal'
import GlobalValue from './global'
import i18n from './i18n'

import '@kube-design/components/esm/styles/index.scss'
import 'scss/main.scss'

require('@babel/polyfill')

// request error handler
window.onunhandledrejection = function(e) {
  if (e && (e.status === 'Failure' || e.status >= 400)) {
    Notify.error({ title: e.reason, content: t(e.message), duration: 6000 })
  }
}

window.t = i18n.t
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

render(<TerminalApp />)

module.hot &&
  module.hot.accept('../pages/terminal', () => {
    const NextApp = require('../pages/terminal').default
    render(<NextApp />)
  })
