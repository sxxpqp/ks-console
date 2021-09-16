import ListLayout from '../containers/Base/List'

import BaseInfo from '../containers/BaseInfo'
import QuotaManage from '../containers/QuotaManage'
import Roles from '../containers/Roles'
import Members from '../containers/Members'
import Groups from '../containers/Groups'
import Projects from '../containers/Projects'
import FedProjects from '../containers/FedProjects'
import DevOps from '../containers/DevOps'
import Apps from '../containers/Apps'
import Repos from '../containers/Repos'

import detail from './detail'
import overviewRoutes from './overview'

const PATH = '/workspaces/:workspace'

export default [
  ...detail,
  {
    path: PATH,
    component: ListLayout,
    routes: [
      ...overviewRoutes,
      {
        path: `${PATH}/federatedprojects`,
        component: FedProjects,
        exact: true,
      },
      {
        path: `${PATH}/projects`,
        component: Projects,
        exact: true,
      },
      {
        path: `${PATH}/devops`,
        component: DevOps,
        exact: true,
      },
      {
        path: `${PATH}/apps`,
        component: Apps,
        exact: true,
      },
      {
        path: `${PATH}/base-info`,
        component: BaseInfo,
        exact: true,
      },
      {
        path: `${PATH}/repos`,
        component: Repos,
        exact: true,
      },
      {
        path: `${PATH}/quota`,
        component: QuotaManage,
        exact: true,
      },
      {
        path: `${PATH}/roles`,
        component: Roles,
        exact: true,
      },
      {
        path: `${PATH}/members`,
        component: Members,
        exact: true,
      },
      {
        path: `${PATH}/groups`,
        component: Groups,
        exact: true,
      },
    ],
  },
]
