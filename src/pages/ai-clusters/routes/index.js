// import { getIndexRoute } from 'utils/router.config'

import AlertMessages from 'projects/containers/Alerting/Messages'
import AlertPolicies from 'projects/containers/Alerting/Policies'

import Nodes from '../containers/Nodes'
import ClusterMonitor from '../containers/Monitor/Cluster'
import ResourceMonitor from '../containers/Monitor/Resource'

const PATH = '/:workspace/clusters/:cluster/projects/:namespace'

export default [
  {
    path: `${PATH}/nodes`,
    component: Nodes,
  },
  {
    path: `${PATH}/monitor-cluster`,
    component: ClusterMonitor,
  },
  {
    path: `${PATH}/monitor-resource`,
    component: ResourceMonitor,
  },
  {
    path: `${PATH}/alerts`,
    component: AlertMessages,
  },
  {
    path: `${PATH}/alert-rules`,
    component: AlertPolicies,
  },
]
