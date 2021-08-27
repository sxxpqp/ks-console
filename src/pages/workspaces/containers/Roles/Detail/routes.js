import { getIndexRoute } from 'utils/router.config'

import AuthorizationList from 'access/containers/Roles/Detail/AuthorizationList'
import AuthorizedUsers from 'access/containers/Roles/Detail/AuthorizedUsers'

const PATH = '/workspaces/:workspace/roles/:name'

export default [
  {
    path: `${PATH}/authorizations`,
    title: 'Authorization List',
    component: AuthorizationList,
    exact: true,
  },
  {
    path: `${PATH}/users`,
    title: 'Authorized Users',
    component: AuthorizedUsers,
    exact: true,
  },
  getIndexRoute({ path: PATH, to: `${PATH}/authorizations`, exact: true }),
]
