import { getIndexRoute } from 'utils/router.config'

import ListLayout from '../containers/Base/List'

import Overview from '../containers/Overview'
import Applications from '../containers/Applications'
import Deployments from '../containers/Deployments'
import StatefulSets from '../containers/StatefulSets'
import Services from '../containers/Services'
import Routes from '../containers/Routes'
import Volumes from '../containers/Volumes'
import BaseInfo from '../containers/BaseInfo'
import ConfigMaps from '../containers/ConfigMaps'
import Secrets from '../containers/Secrets'
import QuotaManage from '../containers/QuotaManage'
import AdvancedSettings from '../containers/AdvancedSettings'

import getDetailPath from './detail'

const PATH = '/:workspace/federatedprojects/:namespace'

export default [
  ...getDetailPath(PATH),
  {
    path: PATH,
    component: ListLayout,
    routes: [
      {
        path: `${PATH}/overview`,
        component: Overview,
        exact: true,
      },
      {
        path: `${PATH}/applications`,
        component: Applications,
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
      { path: `${PATH}/services`, component: Services, exact: true },
      { path: `${PATH}/ingresses`, component: Routes, exact: true },
      { path: `${PATH}/volumes`, component: Volumes, exact: true },
      { path: `${PATH}/base-info`, component: BaseInfo, exact: true },
      { path: `${PATH}/configmaps`, component: ConfigMaps, exact: true },
      { path: `${PATH}/secrets`, component: Secrets, exact: true },
      { path: `${PATH}/quota`, component: QuotaManage, exact: true },
      { path: `${PATH}/advanced`, component: AdvancedSettings, exact: true },
      getIndexRoute({
        path: `${PATH}/workloads`,
        to: `${PATH}/deployments`,
        exact: true,
      }),
      getIndexRoute({ path: PATH, to: `${PATH}/overview`, exact: true }),
      getIndexRoute({ path: '*', to: '/404', exact: true }),
    ],
  },
]
