import { getIndexRoute } from 'utils/router.config'

import ImageBuildRecords from './BuildRecords'
import ResourceStatus from './ResourceStatus'
import Env from './Environment'
import Events from './Events'
import ImageArtifacts from './ImageProduct'

export default path => [
  {
    path: `${path}/records`,
    title: 'Execution Records',
    component: ImageBuildRecords,
    excat: true,
  },
  {
    path: `${path}/resource-status`,
    title: 'Resource Status',
    component: ResourceStatus,
    excat: true,
  },
  {
    path: `${path}/image-artifacts`,
    title: 'Image Artifacts',
    component: ImageArtifacts,
    excat: true,
  },
  {
    path: `${path}/env`,
    title: 'Environment Variables',
    component: Env,
    excat: true,
  },
  { path: `${path}/events`, title: 'Events', component: Events, excat: true },
  getIndexRoute({ path, to: `${path}/records`, exact: true }),
]
