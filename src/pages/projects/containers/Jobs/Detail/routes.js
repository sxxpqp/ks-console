import { getIndexRoute } from 'utils/router.config'

import Events from 'core/containers/Base/Detail/Events'
import EnvVariables from 'core/containers/Base/Detail/EnvVariables'
import Metadata from 'core/containers/Base/Detail/Metadata'
import ResourceStatus from 'projects/containers/Jobs/Detail/ResourceStatus'
import ExcuteRecords from 'projects/containers/Jobs/Detail/ExcuteRecords'

export default path => [
  {
    path: `${path}/records`,
    title: 'Execution Records',
    component: ExcuteRecords,
    exact: true,
  },
  {
    path: `${path}/resource-status`,
    title: 'Resource Status',
    component: ResourceStatus,
    exact: true,
  },
  {
    path: `${path}/metadata`,
    title: 'Metadata',
    component: Metadata,
    exact: true,
  },
  {
    path: `${path}/env`,
    title: 'Environment Variables',
    component: EnvVariables,
    exact: true,
  },
  { path: `${path}/events`, title: 'Events', component: Events, exact: true },
  getIndexRoute({ path, to: `${path}/records`, exact: true }),
]
