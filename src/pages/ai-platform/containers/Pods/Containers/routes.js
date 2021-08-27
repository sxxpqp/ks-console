import { getIndexRoute } from 'utils/router.config'

import EnvVariables from 'core/containers/Base/Detail/EnvVariables'
import ResourceStatus from './ResourceStatus'
import Monitoring from './Monitoring'
import Logs from './Logs'

export default path => [
  {
    path: `${path}/resource-status`,
    title: 'Resource Status',
    component: ResourceStatus,
    exact: true,
  },
  {
    path: `${path}/monitors`,
    title: 'Monitoring',
    component: Monitoring,
    exact: true,
  },
  {
    path: `${path}/env`,
    title: 'Environment Variables',
    component: EnvVariables,
    exact: true,
  },
  {
    path: `${path}/logs`,
    title: 'Container Logs',
    component: Logs,
    exact: true,
  },
  getIndexRoute({ path, to: `${path}/resource-status`, exact: true }),
]
