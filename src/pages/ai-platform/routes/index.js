import { getIndexRoute } from 'utils/router.config'

import PipelinesList from 'ai-devops/containers/Pipelines/PipelinesList'
import Credential from 'ai-devops/containers/Credential'
// 容器资源申请
import Apply from 'ai-review/containers/apply'
// 容器资源申请历史
import ApplyHis from 'ai-review/containers/apply-his'
// 容器资源审批
import Audit from 'ai-review/containers/audit'
import monitorRoutes from 'ai-clusters/routes'
import appRoutes from 'ai-apps/routes'

import StoreManage from 'ai-apps/containers/StoreManage'
// 应用模板
import Apps from 'ai-workspaces/containers/Apps'

import grayReleaseRoutes from './grayrelease'
import ListLayout from '../containers/Base/List'

import Overview from '../containers/Overview'
import CRDApps from '../containers/Applications/CRDApps'
import OPApps from '../containers/Applications/OPApps'
import Deployments from '../containers/Deployments'
import StatefulSets from '../containers/StatefulSets'
import DaemonSets from '../containers/DaemonSets'
import Pods from '../containers/Pods'
// import Jobs from '../containers/Jobs'
import ImageBuilder from '../containers/ImageBuilder'
import CronJobs from '../containers/CronJobs'
import Services from '../containers/Services'
import GrayRelease from '../containers/GrayRelease'
import Routes from '../containers/Routes'
import Volumes from '../containers/Volumes'
import VolumeSnapshots from '../containers/VolumeSnapshots'
import BaseInfo from '../containers/BaseInfo'
import ConfigMaps from '../containers/ConfigMaps'
import ServiceAccounts from '../containers/ServiceAccounts'
import Secrets from '../containers/Secrets'
import Roles from '../containers/Roles'
import Members from '../containers/Members'
import Menus from '../containers/Menus'
import AdvancedSettings from '../containers/AdvancedSettings'
import AlertingPolicies from '../containers/Alerting/Policies'
import AlertingMessages from '../containers/Alerting/Messages'
import CustomMonitoring from '../containers/CustomMonitoring'
import NetworkPolicies from '../containers/Network/Policies'

import getDetailPath from './detail'

const PATH = '/:workspace/clusters/:cluster/projects/:namespace'

export default [
  ...getDetailPath(PATH),
  ...appRoutes,
  {
    path: PATH,
    component: ListLayout,
    routes: [
      ...grayReleaseRoutes,
      ...monitorRoutes,
      // 部署应用相关
      getIndexRoute({
        path: `${PATH}/devops/:devops`,
        to: `${PATH}/devops/:devops/pipelines`,
        exact: true,
      }),
      // 审核相关路由
      {
        // 申请
        path: `${PATH}/apply`,
        component: Apply,
        exact: true,
      },
      {
        // 申请历史
        path: `${PATH}/applyhis`,
        component: ApplyHis,
        exact: true,
      },
      {
        // 审批
        path: `${PATH}/audit`,
        component: Audit,
        exact: true,
      },
      {
        // 模板仓库管理
        path: `${PATH}/template`,
        component: StoreManage,
        exact: true,
      },
      {
        // 创建应用模板
        path: `${PATH}/appstemp`,
        component: Apps,
        exact: true,
      },
      {
        // 菜单管理
        path: `${PATH}/menu`,
        component: Menus,
        exact: true,
      },
      {
        path: `${PATH}/devops/:devops/pipelines`,
        component: PipelinesList,
        exact: true,
      },
      {
        path: `${PATH}/devops/:devops/credentials`,
        component: Credential,
        exact: true,
      },
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
      // 生命周期的管理 - 工作负载
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
      // 关闭容器组、任务
      { path: `${PATH}/pods`, component: Pods, exact: true },
      // { path: `${PATH}/jobs`, component: Jobs, exact: true },
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
      { path: `${PATH}/configmaps`, component: ConfigMaps, exact: true },
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
      // gitlab
      {
        name: 'gitlab',
        path: `${PATH}/gitlab`,
        link: 'http://test.bontor.cn:30000',
      },
      {
        name: 'harbor',
        path: `${PATH}/harbor`,
        link: 'http://test.bontor.cn:30006',
      },
      getIndexRoute({
        path: `${PATH}/workloadsPods`,
        to: `${PATH}/deployments`,
        exact: true,
      }),
      getIndexRoute({
        path: `${PATH}/applications`,
        to: `${PATH}/applications/${getDefaultAppType()}`,
        exact: true,
      }),
      getIndexRoute({ path: PATH, to: `${PATH}/overview`, exact: true }),
      // 测试重定向
      // {
      //   path: `${PATH}/devops1`,
      //   redirect: { from: `${PATH}/devops1`, to: `${DevOpsPATH}`, exact: true },
      // },
      getIndexRoute({ path: '*', to: '/404', exact: true }),
    ],
  },
]

function getDefaultAppType() {
  return globals.app.hasKSModule('openpitrix') ? 'template' : 'composing'
}
