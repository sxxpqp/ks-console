import { getIndexRoute } from 'utils/router.config'

import Overview from './Overview'
import PhysicalResourceMonitoring from './Monitor/PhysicalResource'
import EtcdMonitoring from './Monitor/Etcd'
import APIServerMonitoring from './Monitor/APIServer'
import SchedulerMonitoring from './Monitor/Scheduler'
import NodeUsageRanking from './Ranking'

// const PATH = '/clusters/:cluster/monitor-cluster'
const PATH = '/:workspace/clusters/:cluster/projects/:namespace/monitor-cluster'
export default [
  {
    path: `${PATH}/overview`,
    title: 'Overview',
    component: Overview,
    exact: true,
  },
  {
    path: `${PATH}/resource`,
    title: 'Physical Resources Monitoring',
    component: PhysicalResourceMonitoring,
    exact: true,
  },
  {
    path: `${PATH}/etcd`,
    title: 'ETCD Monitoring',
    component: EtcdMonitoring,
    requireETCD: true,
    exact: true,
  },
  {
    path: `${PATH}/api-server`,
    title: 'APIServer Monitoring',
    component: APIServerMonitoring,
    exact: true,
  },
  {
    path: `${PATH}/scheduler`,
    title: 'Scheduler Monitoring',
    component: SchedulerMonitoring,
    exact: true,
  },
  {
    path: `${PATH}/ranking`,
    title: 'Node Usage Ranking',
    component: NodeUsageRanking,
    exact: true,
  },
  getIndexRoute({ path: PATH, to: `${PATH}/overview`, exact: true }),
]
