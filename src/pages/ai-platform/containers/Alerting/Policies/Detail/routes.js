import { getIndexRoute } from 'utils/router.config'

import AlertingRules from './AlertRules'
import AlertingMessages from './AlertMessages'

export default path => [
  {
    path: `${path}/rules`,
    title: 'Alerting Rules',
    component: AlertingRules,
    exact: true,
  },
  {
    path: `${path}/messages`,
    title: 'Alerting Messages',
    component: AlertingMessages,
    exact: true,
  },
  getIndexRoute({ path, to: `${path}/rules`, exact: true }),
]
