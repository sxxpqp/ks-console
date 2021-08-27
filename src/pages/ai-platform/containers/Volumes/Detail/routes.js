import { getIndexRoute } from 'utils/router.config'

import Events from 'core/containers/Base/Detail/Events'
import Metadata from 'core/containers/Base/Detail/Metadata'
import ResourceStatus from './ResourceStatus'
import Snapshots from './Snapshots'

export default PATH => [
  {
    path: `${PATH}/resource-status`,
    title: 'Resource Status',
    exact: true,
    component: ResourceStatus,
  },
  {
    path: `${PATH}/metadata`,
    title: 'Metadata',
    component: Metadata,
    exact: true,
  },
  {
    path: `${PATH}/events`,
    title: 'Events',
    exact: true,
    component: Events,
  },
  {
    path: `${PATH}/snapshot`,
    title: 'Snapshots Message',
    exact: true,
    component: Snapshots,
  },
  getIndexRoute({ path: PATH, to: `${PATH}/resource-status`, exact: true }),
]
