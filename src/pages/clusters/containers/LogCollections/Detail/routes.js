import { getIndexRoute } from 'utils/router.config'

import ResourceStatus from './Configuration'

const PATH = '/clusters/:cluster/log-collections/:component/:name'

export default [
  {
    path: `${PATH}/resource-status`,
    title: 'Resource Status',
    component: ResourceStatus,
    exact: true,
  },
  getIndexRoute({ path: PATH, to: `${PATH}/resource-status`, exact: true }),
]
