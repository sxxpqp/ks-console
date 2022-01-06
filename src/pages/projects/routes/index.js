import { getIndexRoute } from 'utils/router.config'

import ListLayout from '../containers/Base/List'

import Overview from '../containers/Overview'
import CRDApps from '../containers/Applications/CRDApps'
import OPApps from '../containers/Applications/OPApps'
import Deployments from '../containers/Deployments'
import StatefulSets from '../containers/StatefulSets'
import DaemonSets from '../containers/DaemonSets'
import Pods from '../containers/Pods'
import Jobs from '../containers/Jobs'
import ImageBuilder from '../containers/ImageBuilder'
import CronJobs from '../containers/CronJobs'
import Services from '../containers/Services'
import GrayRelease from '../containers/GrayRelease'
import Routes from '../containers/Routes'
import Volumes from '../containers/Volumes'
import VolumeSnapshots from '../containers/VolumeSnapshots'
import BaseInfo from '../containers/BaseInfo'
// import ConfigMaps from '../containers/ConfigMaps'
import ServiceAccounts from '../containers/ServiceAccounts'
import Secrets from '../containers/Secrets'
import Roles from '../containers/Roles'
import Members from '../containers/Members'
import AdvancedSettings from '../containers/AdvancedSettings'
import AlertingPolicies from '../containers/Alerting/Policies'
import AlertingMessages from '../containers/Alerting/Messages'
import CustomMonitoring from '../containers/CustomMonitoring'
import NetworkPolicies from '../containers/Network/Policies'

import grayReleaseRoutes from './grayrelease'

import getDetailPath from './detail'

const PATH = '/:workspace/clusters/:cluster/projects/:namespace'

export default [
  ...getDetailPath(PATH),
  {
    path: PATH,
    component: ListLayout,
    routes: [
      ...grayReleaseRoutes,
      {
        path: `${PATH}/overview`,
        component: Overview,
        exact: true,
      },
      {
        path: `${PATH}/applications/composing`,
        component: CRDApps,
        exact: true,
      },
      {
        path: `${PATH}/applications/template`,
        component: OPApps,
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
      { path: `${PATH}/pods`, component: Pods, exact: true },
      { path: `${PATH}/jobs`, component: Jobs, exact: true },
      {
        path: `${PATH}/s2ibuilders`,
        component: ImageBuilder,
        exact: true,
      },
      { path: `${PATH}/cronjobs`, component: CronJobs, exact: true },
      { path: `${PATH}/services`, component: Services, exact: true },
      {
        path: `${PATH}/grayrelease`,
        component: GrayRelease,
        exact: true,
      },
      { path: `${PATH}/ingresses`, component: Routes, exact: true },
      { path: `${PATH}/volumes`, component: Volumes, exact: true },
      {
        path: `${PATH}/volume-snapshots`,
        component: VolumeSnapshots,
        exact: true,
      },
      { path: `${PATH}/base-info`, component: BaseInfo, exact: true },
      {
        path: `${PATH}/networkpolicies`,
        component: NetworkPolicies,
        exact: true,
      },
      // { path: `${PATH}/configmaps`, component: ConfigMaps, exact: true },
      {
        path: `${PATH}/serviceaccounts`,
        component: ServiceAccounts,
        exact: true,
      },
      { path: `${PATH}/secrets`, component: Secrets, exact: true },
      { path: `${PATH}/roles`, component: Roles, exact: true },
      { path: `${PATH}/members`, component: Members, exact: true },
      { path: `${PATH}/advanced`, component: AdvancedSettings, exact: true },
      {
        path: `${PATH}/alert-rules`,
        component: AlertingPolicies,
        exact: true,
      },
      {
        path: `${PATH}/alerts`,
        component: AlertingMessages,
        exact: true,
      },
      {
        path: `${PATH}/custom-monitoring`,
        component: CustomMonitoring,
        exact: true,
      },
      getIndexRoute({
        path: `${PATH}/workloads`,
        to: `${PATH}/deployments`,
        exact: true,
      }),
      getIndexRoute({
        path: `${PATH}/applications`,
        to: `${PATH}/applications/${getDefaultAppType()}`,
        exact: true,
      }),
      getIndexRoute({ path: PATH, to: `${PATH}/overview`, exact: true }),
      getIndexRoute({ path: '*', to: '/404', exact: true }),
    ],
  },
]

function getDefaultAppType() {
  return globals.app.hasKSModule('openpitrix') ? 'template' : 'composing'
}
