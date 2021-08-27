import { getIndexRoute } from 'utils/router.config'

import Events from 'core/containers/Base/Detail/Events'
import EnvVariables from 'core/containers/Base/Detail/EnvVariables'
import Metadata from 'core/containers/Base/Detail/Metadata'
import ResourceStatus from './ResourceStatus'
import RevisionControl from './RevisionControl'
import Monitoring from './Monitoring'

export default path => [
  {
    path: `${path}/resource-status`,
    title: 'Resource Status',
    component: ResourceStatus,
    exact: true,
  },
  {
    path: `${path}/revision-control`,
    title: 'Revision Records',
    component: RevisionControl,
    exact: true,
  },
  {
    path: `${path}/metadata`,
    title: 'Metadata',
    component: Metadata,
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
  { path: `${path}/events`, title: 'Events', component: Events, exact: true },
  getIndexRoute({ path, to: `${path}/resource-status`, exact: true }),
]
