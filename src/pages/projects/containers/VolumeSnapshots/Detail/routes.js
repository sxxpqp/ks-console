import { getIndexRoute } from 'utils/router.config'
import Events from 'core/containers/Base/Detail/Events'
import Source from './Source'

export default PATH => [
  {
    name: 'source',
    path: `${PATH}/source`,
    title: 'DATA_SOURCE',
    component: Source,
  },
  {
    name: 'event',
    path: `${PATH}/event`,
    title: 'Events',
    component: Events,
  },
  getIndexRoute({ path: PATH, to: `${PATH}/source`, exact: true }),
  getIndexRoute({ path: '*', to: '/404', exact: true }),
]
