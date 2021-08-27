import { get } from 'lodash'
import { getIndexRoute } from 'utils/router.config'

import Layout from '../containers/layout'
import BaseInfo from '../containers/BaseInfo'
import ThirdPartyLogin from '../containers/ThirdPartyLogin'
import Mail from '../containers/Notification/Mail'
import DingTalk from '../containers/Notification/DingTalk'
import WeCom from '../containers/Notification/WeCom'
import Slack from '../containers/Notification/Slack'
import Webhook from '../containers/Notification/Webhook'

const PATH = '/settings'

const navs = globals.app.getPlatformSettingsNavs()
const indexRoute = get(navs, '[0].items[0].name', 'nodes')

export default [
  {
    path: PATH,
    component: Layout,
    routes: [
      {
        path: `${PATH}/base-info`,
        component: BaseInfo,
      },
      {
        path: `${PATH}/third-login`,
        component: ThirdPartyLogin,
      },
      {
        path: `${PATH}/mail`,
        component: Mail,
      },
      {
        path: `${PATH}/dingtalk`,
        component: DingTalk,
      },
      {
        path: `${PATH}/wecom`,
        component: WeCom,
      },
      {
        path: `${PATH}/slack`,
        component: Slack,
      },
      {
        path: `${PATH}/webhook`,
        component: Webhook,
      },
      getIndexRoute({ path: PATH, to: `${PATH}/${indexRoute}`, exact: true }),
      getIndexRoute({ path: '*', to: '/404', exact: true }),
    ],
  },
]
