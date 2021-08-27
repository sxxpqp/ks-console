import { getIndexRoute } from 'utils/router.config'

import ServiceDetails from './ServiceDetails'

const PATH = '/clusters/:cluster/components/:namespace/:name'

export default [
  {
    path: `${PATH}/service-details`,
    title: 'Service Details',
    component: ServiceDetails,
    exact: true,
  },

  getIndexRoute({ path: PATH, to: `${PATH}/service-details`, exact: true }),
]
