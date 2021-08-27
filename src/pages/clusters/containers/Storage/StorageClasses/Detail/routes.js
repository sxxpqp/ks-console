import { getIndexRoute } from 'utils/router.config'
import Volumes from './Volumes'

const PATH = '/clusters/:cluster/storageclasses/:name'

export default [
  {
    name: 'volumes',
    path: `${PATH}/volumes`,
    title: 'Volumes',
    component: Volumes,
  },
  getIndexRoute({ path: PATH, to: `${PATH}/volumes`, exact: true }),
  getIndexRoute({ path: '*', to: '/404', exact: true }),
]
