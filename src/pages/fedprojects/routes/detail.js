import AppDetail from '../containers/Applications/Detail'
import DeploymentDetail from '../containers/Deployments/Detail'
import StatefulSetDetail from '../containers/StatefulSets/Detail'
import ServiceDetail from '../containers/Services/Detail'
import RouteDetail from '../containers/Routes/Detail'
import VolumeDetail from '../containers/Volumes/Detail'
import SecretDetail from '../containers/Secrets/Detail'
import ConfigMapDetail from '../containers/ConfigMaps/Detail'

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
    path: `${PATH}/secrets/:name`,
    component: SecretDetail,
  },
  {
    path: `${PATH}/configmaps/:name`,
    component: ConfigMapDetail,
  },
  {
    path: `${PATH}/applications/:name`,
    component: AppDetail,
  },
]
