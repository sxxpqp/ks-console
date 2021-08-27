import { getIndexRoute } from 'utils/router.config'

import Components from './Components'
import TrafficManangement from './TrafficManangement'
import GrayRelease from './GrayRelease'
import Tracing from './Tracing'

const PATH =
  '/:workspace/clusters/:cluster/projects/:namespace/applications/composing/:name'

export default [
  {
    path: `${PATH}/components`,
    title: 'Application Components',
    component: Components,
    exact: true,
  },
  {
    path: `${PATH}/traffic`,
    title: 'Traffic Management',
    component: TrafficManangement,
    clusterModule: 'servicemesh',
    exact: true,
  },
  {
    path: `${PATH}/grayrelease`,
    title: 'Grayscale Release',
    component: GrayRelease,
    clusterModule: 'servicemesh',
    exact: true,
  },
  {
    path: `${PATH}/tracing`,
    title: 'Tracing',
    component: Tracing,
    clusterModule: 'servicemesh',
    exact: true,
  },
  getIndexRoute({ path: PATH, to: `${PATH}/components`, exact: true }),
]
