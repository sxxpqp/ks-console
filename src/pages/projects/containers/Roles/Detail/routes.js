import { getIndexRoute } from 'utils/router.config'

import AuthorizationList from 'access/containers/Roles/Detail/AuthorizationList'
import AuthorizedUsers from 'access/containers/Roles/Detail/AuthorizedUsers'

export default path => [
  {
    path: `${path}/authorizations`,
    title: 'Authorization List',
    component: AuthorizationList,
    exact: true,
  },
  {
    path: `${path}/users`,
    title: 'Authorized Users',
    component: AuthorizedUsers,
    exact: true,
  },
  getIndexRoute({ path, to: `${path}/authorizations`, exact: true }),
]
