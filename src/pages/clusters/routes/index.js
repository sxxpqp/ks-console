import { getIndexRoute } from 'utils/router.config'

import AlertMessages from 'projects/containers/Alerting/Messages'
import AlertPolicies from 'projects/containers/Alerting/Policies'

import ClusterLayout from '../containers/layout'
import ListLayout from '../containers/Base/List'

import Clusters from '../containers/Clusters'
import Overview from '../containers/Overview'
import StorageClasses from '../containers/Storage/StorageClasses'
import VolumeSnapshots from '../containers/Storage/VolumeSnapshots'
import Volumes from '../containers/Storage/Volumes'
import Nodes from '../containers/Nodes'
import EdgeNodes from '../containers/EdgeNodes/index'
import ServiceComponents from '../containers/ServiceComponents'
import Projects from '../containers/Projects'
import CustomResources from '../containers/CustomResources'

import Deployments from '../containers/Workload/Deployments'
import StatefulSets from '../containers/Workload/StatefulSets'
import DaemonSets from '../containers/Workload/DaemonSets'
import Jobs from '../containers/Workload/Jobs'
import CronJobs from '../containers/Workload/CronJobs'
import Pods from '../containers/Workload/Pods'
import Services from '../containers/Workload/Services'
import Routes from '../containers/Workload/Routes'
import Secrets from '../containers/Secrets'
// import ConfigMaps from '../containers/ConfigMaps'
import ServiceAccounts from '../containers/ServiceAccounts'
import ClusterMonitor from '../containers/Monitor/Cluster'
import ResourceMonitor from '../containers/Monitor/Resource'
import Members from '../containers/Members'
import Roles from '../containers/Roles'
import BaseInfo from '../containers/BaseInfo'
import Visibility from '../containers/Visibility'
import KubeConfig from '../containers/KubeConfig'
import NetworkPolicies from '../containers/Network/Policies'
import IPPools from '../containers/Network/IPPools'
import LogCollections from '../containers/LogCollections'
import CustomMonitoring from '../containers/CustomMonitoring'

import detail from './detail'

const PATH = '/clusters/:cluster'

export default [
  {
    path: '/clusters',
    component: Clusters,
    redirect: globals.app.isMultiCluster
      ? null
      : {
          from: '/clusters',
          to: '/clusters/default/overview',
          exact: true,
        },
    exact: true,
  },
  {
    path: PATH,
    component: ClusterLayout,
    routes: [
      ...detail,
      {
        path: `${PATH}/kubeConfig`,
        component: KubeConfig,
        exact: true,
      },
      {
        path: '',
        component: ListLayout,
        routes: [
          {
            path: `${PATH}/overview`,
            component: Overview,
            exact: true,
          },
          {
            path: `${PATH}/nodes`,
            component: Nodes,
          },
          {
            path: `${PATH}/edgenodes`,
            component: EdgeNodes,
            exact: true,
          },
          {
            path: `${PATH}/components`,
            component: ServiceComponents,
            exact: true,
          },
          {
            path: `${PATH}/projects`,
            component: Projects,
            exact: true,
          },
          {
            path: `${PATH}/customresources`,
            component: CustomResources,
            exact: true,
          },
          {
            path: `${PATH}/deployments`,
            component: Deployments,
            exact: true,
          },
          {
            path: `${PATH}/statefulsets`,
            component: StatefulSets,
            exact: true,
          },
          {
            path: `${PATH}/daemonsets`,
            component: DaemonSets,
            exact: true,
          },
          {
            path: `${PATH}/jobs`,
            component: Jobs,
            exact: true,
          },
          {
            path: `${PATH}/cronjobs`,
            component: CronJobs,
            exact: true,
          },
          {
            path: `${PATH}/pods`,
            component: Pods,
            exact: true,
          },
          {
            path: `${PATH}/services`,
            component: Services,
            exact: true,
          },
          {
            path: `${PATH}/ingresses`,
            component: Routes,
            exact: true,
          },
          {
            path: `${PATH}/secrets`,
            component: Secrets,
            exact: true,
          },
          // {
          //   path: `${PATH}/configmaps`,
          //   component: ConfigMaps,
          //   exact: true,
          // },
          {
            path: `${PATH}/serviceaccounts`,
            component: ServiceAccounts,
            exact: true,
          },
          {
            path: `${PATH}/storageclasses`,
            component: StorageClasses,
            exact: true,
          },
          {
            path: `${PATH}/volumes`,
            component: Volumes,
            exact: true,
          },
          {
            path: `${PATH}/volume-snapshots`,
            component: VolumeSnapshots,
            exact: true,
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
          {
            path: `${PATH}/base-info`,
            component: BaseInfo,
            exact: true,
          },
          {
            path: `${PATH}/visibility`,
            component: Visibility,
            exact: true,
          },
          {
            path: `${PATH}/members`,
            component: Members,
            exact: true,
          },
          {
            path: `${PATH}/roles`,
            component: Roles,
            exact: true,
          },
          {
            path: `${PATH}/storageclasses`,
            component: StorageClasses,
            exact: true,
          },
          {
            path: `${PATH}/snapshots/:namespace?`,
            component: VolumeSnapshots,
          },
          {
            path: `${PATH}/networkpolicies`,
            component: NetworkPolicies,
            exact: true,
          },
          {
            path: `${PATH}/ippools`,
            component: IPPools,
            exact: true,
          },
          {
            path: `${PATH}/log-collections/:component`,
            component: LogCollections,
          },
          {
            path: `${PATH}/custom-monitoring`,
            component: CustomMonitoring,
            exact: true,
          },
          getIndexRoute({ path: PATH, to: `${PATH}/overview`, exact: true }),
          getIndexRoute({
            path: `${PATH}/workloads`,
            to: `${PATH}/deployments`,
            exact: true,
          }),
          getIndexRoute({
            path: `${PATH}/log-collections`,
            to: `${PATH}/log-collections/logging`,
            exact: true,
          }),
          getIndexRoute({ path: '*', to: '/404', exact: true }),
        ],
      },
    ],
  },
]
