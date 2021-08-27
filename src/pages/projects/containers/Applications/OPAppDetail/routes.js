import { getIndexRoute } from 'utils/router.config'

import ResourceStatus from './ResourceStatus'
import AppTemplate from './AppTemplate'
import AppConfig from './AppConfig'

const PATH =
  '/:workspace/clusters/:cluster/projects/:namespace/applications/template/:id'

export default [
  {
    path: `${PATH}/resource-status`,
    name: 'resource-status',
    title: 'Resource Status',
    component: ResourceStatus,
    exact: true,
  },
  {
    path: `${PATH}/template`,
    title: 'App Template',
    component: AppTemplate,
    exact: true,
  },
  {
    path: `${PATH}/config`,
    title: 'App Config',
    component: AppConfig,
    exact: true,
  },
  getIndexRoute({ path: PATH, to: `${PATH}/resource-status`, exact: true }),
]
