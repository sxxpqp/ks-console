import { getIndexRoute } from 'utils/router.config'
import Viewer from './Viewer'

export default path => [
  {
    path: `${path}/egress`,
    title: t('Traffic Egress'),
    component: Viewer,
    exact: true,
  },
  {
    path: `${path}/ingress`,
    title: t('Traffic Ingress'),
    component: Viewer,
    exact: true,
  },
  getIndexRoute({ path, to: `${path}/egress`, exact: true }),
]
