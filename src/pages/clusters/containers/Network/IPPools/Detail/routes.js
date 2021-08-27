import { getIndexRoute } from 'utils/router.config'

import Workspaces from './Workspaces'
import Pods from './Pods'

const PATH = '/clusters/:cluster/ippools/:name'

export default [
  {
    path: `${PATH}/workspaces`,
    title: 'Workspaces',
    component: Workspaces,
    exact: true,
  },
  { path: `${PATH}/pods`, title: 'Pods', component: Pods, exact: true },
  getIndexRoute({ path: PATH, to: `${PATH}/workspaces`, exact: true }),
]
