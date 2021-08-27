import { getIndexRoute } from 'utils/router.config'

import LoginHistory from './LoginHistory'

const PATH = '/access/accounts/:name'

export default [
  {
    path: `${PATH}/login-history`,
    title: 'Login History',
    component: LoginHistory,
    exact: true,
  },
  getIndexRoute({ path: PATH, to: `${PATH}/login-history`, exact: true }),
]
