import { getIndexRoute } from 'utils/router.config'

import AppComponents from './AppComponents'
import AppIngresses from './AppIngresses'
import TrafficManangement from './TrafficManangement'
import Tracing from './Tracing'

const PATH = '/:workspace/federatedprojects/:namespace/applications/:name'

export default [
  {
    path: `${PATH}/components`,
    title: 'Application Components',
    component: AppComponents,
    exact: true,
  },
  {
    path: `${PATH}/ingresses`,
    title: 'Internet Access',
    component: AppIngresses,
    exact: true,
  },
  {
    path: `${PATH}/traffic`,
    title: 'Traffic Management',
    component: TrafficManangement,
    exact: true,
  },
  {
    path: `${PATH}/tracing`,
    title: 'Tracing',
    component: Tracing,
    exact: true,
  },
  getIndexRoute({ path: PATH, to: `${PATH}/components`, exact: true }),
]
