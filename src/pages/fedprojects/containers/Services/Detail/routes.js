import { getIndexRoute } from 'utils/router.config'

import Events from 'core/containers/Base/Detail/Events'
import Metadata from 'core/containers/Base/Detail/Metadata'
import ResourceStatus from './ResourceStatus'
import ServiceAccess from './ServiceAccess'

export default (path, detail) => [
  {
    path: `${path}/resource-status`,
    title: 'Resource Status',
    component: ResourceStatus,
    exact: true,
  },
  ...(detail.isFedManaged
    ? [
        {
          path: `${path}/access`,
          title: 'Service Access',
          component: ServiceAccess,
          exact: true,
        },
      ]
    : []),
  {
    path: `${path}/metadata`,
    title: 'Metadata',
    component: Metadata,
    exact: true,
  },
  { path: `${path}/events`, title: 'Events', component: Events, exact: true },
  getIndexRoute({ path, to: `${path}/resource-status`, exact: true }),
]
