import { getIndexRoute } from 'utils/router.config'

import Events from 'core/containers/Base/Detail/Events'
import Metadata from 'core/containers/Base/Detail/Metadata'
import JobRecords from './JobRecords'

export default path => [
  {
    path: `${path}/records`,
    title: 'Job Records',
    component: JobRecords,
    exact: true,
  },
  {
    path: `${path}/metadata`,
    title: 'Metadata',
    component: Metadata,
    exact: true,
  },
  { path: `${path}/events`, title: 'Events', component: Events, exact: true },
  getIndexRoute({ path, to: `${path}/records`, exact: true }),
]
