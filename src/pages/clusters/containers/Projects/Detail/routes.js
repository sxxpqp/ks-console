import { getIndexRoute } from 'utils/router.config'

import Overview from './Overview'
import Pods from './Pods'
import Gateway from './Gateway'
import Quota from './Quota'

const PATH = '/clusters/:cluster/projects/:namespace'

export default [
  {
    path: `${PATH}/overview`,
    title: 'Project Overview',
    component: Overview,
    exact: true,
  },
  { path: `${PATH}/pods`, title: 'Pods', component: Pods, exact: true },
  {
    path: `${PATH}/gateway`,
    title: 'Gateway Info',
    component: Gateway,
    exact: true,
  },
  {
    path: `${PATH}/quota`,
    title: 'Project Quota',
    component: Quota,
    exact: true,
  },
  getIndexRoute({ path: PATH, to: `${PATH}/overview`, exact: true }),
]
