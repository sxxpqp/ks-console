import Layout from '../containers/layout'
import Accounts from '../containers/Accounts'
import Roles from '../containers/Roles'
import Workspaces from '../containers/Workspaces'

import detail from './detail'

const PATH = '/access'

export default [
  ...detail,
  {
    path: PATH,
    component: Layout,
    routes: [
      { path: `${PATH}/accounts`, component: Accounts, exact: true },
      { path: `${PATH}/roles`, component: Roles, exact: true },
      { path: `${PATH}/workspaces`, component: Workspaces, exact: true },
    ],
  },
]
