import { getIndexRoute } from 'utils/router.config'

import AuthorizationList from './AuthorizationList'
import AuthorizedUsers from './AuthorizedUsers'

const PATH = '/access/roles/:name'

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
