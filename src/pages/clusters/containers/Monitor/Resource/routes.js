import { getIndexRoute } from 'utils/router.config'

import Usage from './Usage'
import UsageRanking from './Ranking'

const PATH = '/clusters/:cluster/monitor-resource'
export default [
  {
    path: `${PATH}/usage`,
    title: 'Usage',
    component: Usage,
    exact: true,
  },
  {
    path: `${PATH}/ranking`,
    title: 'Usage Ranking',
    component: UsageRanking,
    exact: true,
  },
  getIndexRoute({ path: PATH, to: `${PATH}/usage`, exact: true }),
]
