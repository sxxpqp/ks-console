import DeploymentDetail from '../containers/Deployments/Detail'
import StatefulSetDetail from '../containers/StatefulSets/Detail'
import DaemonSetDetail from '../containers/DaemonSets/Detail'
import JobDetail from '../containers/Jobs/Detail'
import CronJobDetail from '../containers/CronJobs/Detail'
import PodDetail from '../containers/Pods/Detail'
import ContainerDetail from '../containers/Pods/Containers/Detail'
import ServiceDetail from '../containers/Services/Detail'
import RouteDetail from '../containers/Routes/Detail'
import VolumeDetail from '../containers/Volumes/Detail'
import VolumeSnapshotDetail from '../containers/VolumeSnapshots/Detail'
import SecretDetail from '../containers/Secrets/Detail'
import ConfigMapDetail from '../containers/ConfigMaps/Detail'
import ServiceAccountDetail from '../containers/ServiceAccounts/Detail'
import CRDAppDetail from '../containers/Applications/CRDAppDetail'
import OPAppDetail from '../containers/Applications/OPAppDetail'
import RoleDetail from '../containers/Roles/Detail'
import ImageBuilderDetail from '../containers/ImageBuilder/Detail'
import AlertPoliciesDetail from '../containers/Alerting/Policies/Detail'

export default PATH => [
  {
    path: `${PATH}/deployments/:name`,
    component: DeploymentDetail,
  },
  {
    path: `${PATH}/statefulsets/:name`,
    component: StatefulSetDetail,
  },
  {
    path: `${PATH}/daemonsets/:name`,
    component: DaemonSetDetail,
  },
  {
    path: `${PATH}/jobs/:name`,
    component: JobDetail,
  },
  {
    path: `${PATH}/cronjobs/:name`,
    component: CronJobDetail,
  },
  // 容器组详情
  {
    path: `${PATH}/pods/:podName/containers/:containerName`,
    component: ContainerDetail,
  },
  {
    path: `${PATH}/pods/:podName`,
    component: PodDetail,
  },
  {
    path: `${PATH}/services/:name`,
    component: ServiceDetail,
  },
  {
    path: `${PATH}/ingresses/:name`,
    component: RouteDetail,
  },
  {
    path: `${PATH}/volumes/:name`,
    component: VolumeDetail,
  },
  {
    path: `${PATH}/volume-snapshots/:name`,
    component: VolumeSnapshotDetail,
  },
  {
    path: `${PATH}/secrets/:name`,
    component: SecretDetail,
  },
  {
    path: `${PATH}/configmaps/:name`,
    component: ConfigMapDetail,
  },
  {
    path: `${PATH}/serviceAccounts/:name`,
    component: ServiceAccountDetail,
  },
  {
    path: `${PATH}/applications/composing/:name`,
    component: CRDAppDetail,
  },
  {
    path: `${PATH}/applications/template/:id`,
    component: OPAppDetail,
  },
  {
    path: `${PATH}/roles/:name`,
    component: RoleDetail,
  },
  {
    path: `${PATH}/s2ibuilders/:name`,
    component: ImageBuilderDetail,
  },
  {
    path: [`${PATH}/alert-rules/builtin/:name`, `${PATH}/alert-rules/:name`],
    component: AlertPoliciesDetail,
  },
]
