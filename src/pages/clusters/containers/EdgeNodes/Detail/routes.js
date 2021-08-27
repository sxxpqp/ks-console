import { getIndexRoute } from 'utils/router.config'

import Metadata from 'core/containers/Base/Detail/Metadata'
import RunningStatus from './RunningStatus'
import Pods from './Pods'
import Events from './Events'

const PATH = '/clusters/:cluster/edgenodes/:node'

export default [
  {
    path: `${PATH}/status`,
    title: 'Running Status',
    component: RunningStatus,
    exact: true,
  },
  { path: `${PATH}/pods`, title: 'Pods', component: Pods, exact: true },
  {
    path: `${PATH}/metadata`,
    title: 'Metadata',
    component: Metadata,
    exact: true,
  },
  { path: `${PATH}/events`, title: 'Events', component: Events, exact: true },
  getIndexRoute({ path: PATH, to: `${PATH}/status`, exact: true }),
]
