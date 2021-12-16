// import { getIndexRoute } from 'utils/router.config'

// import AlertMessages from 'projects/containers/Alerting/Messages'
import AlertPolicies from 'projects/containers/Alerting/Policies'
import AlertMsg from '../containers/AlertsMsg'

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
  // 告警消息
  {
    path: `${PATH}/alerts`,
    component: AlertMsg,
  },
  // 告警策略
  {
    path: `${PATH}/alert-rules`,
    component: AlertPolicies,
  },
  // 告警消息
  //   {
  //     path: `${PATH}/alerts1`,
  //     component: AlertMessages,
  //   },
  //   // 告警策略
  //   {
  //     path: `${PATH}/alert-rules1`,
  //     component: AlertPolicies,
  //   },
]
