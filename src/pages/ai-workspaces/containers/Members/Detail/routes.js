import { getIndexRoute } from 'utils/router.config'

import Projects from './Projects'
import DevOps from './DevOps'

const PATH = '/workspaces/:workspace/members/:name'

export default [
  {
    path: `${PATH}/projects`,
    title: 'Projects',
    component: Projects,
    exact: true,
  },
  {
    path: `${PATH}/devops`,
    title: 'DevOps Projects',
    component: DevOps,
    ksModule: 'devops',
    exact: true,
  },
  getIndexRoute({ path: PATH, to: `${PATH}/projects`, exact: true }),
]
