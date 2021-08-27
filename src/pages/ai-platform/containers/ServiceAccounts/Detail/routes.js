import { getIndexRoute } from 'utils/router.config'

import ServiceAccountDetail from './ServiceAccountDetail'

export default path => [
  {
    path: `${path}/detail`,
    title: 'Detail',
    component: ServiceAccountDetail,
    exact: true,
  },
  getIndexRoute({ path, to: `${path}/detail`, exact: true }),
]
