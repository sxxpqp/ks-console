import { getChildRoutes } from 'utils/router.config'

import OverviewLayout from '../containers/Overview'
import ResourceUsage from '../containers/Overview/ResourceUsage'
import UsageRanking from '../containers/Overview/UsageRanking'
import Clusters from '../containers/Overview/Clusters'

const PATH = '/workspaces/:workspace/overview'
const ROUTES = [
  { name: 'usage', title: 'Resources Usage', component: ResourceUsage },
  { name: 'ranking', title: 'Usage Ranking', component: UsageRanking },
  {
    name: 'clusters',
    title: 'Cluster Info',
    component: Clusters,
    multiCluster: true,
  },
]

export default [
  {
    path: PATH,
    component: OverviewLayout,
    routes: getChildRoutes(
      ROUTES.filter(item => !item.multiCluster || globals.app.isMultiCluster),
      PATH
    ),
  },
]
