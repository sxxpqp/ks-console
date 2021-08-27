import { getIndexRoute } from 'utils/router.config'

import ResourceStatus from './ResourceStatus'

const PATH = '/clusters/:cluster/customresources/:name'

export default [
  {
    path: `${PATH}/resources`,
    title: 'Resource Status',
    component: ResourceStatus,
    exact: true,
  },
  getIndexRoute({ path: PATH, to: `${PATH}/resources`, exact: true }),
]
