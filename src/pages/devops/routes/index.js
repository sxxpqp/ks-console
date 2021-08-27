import { getIndexRoute } from 'utils/router.config'

import Layout from '../containers/layout'
import DevopsListLayout from '../containers/Base/List'
import PipelinesList from '../containers/Pipelines/PipelinesList'
import BaseInfo from '../containers/BaseInfo'
import Roles from '../containers/Roles'
import Members from '../containers/Members'
import Credential from '../containers/Credential'

import detail from './detail'

const PATH = '/:workspace/clusters/:cluster/devops/:devops'

export default [
  {
    path: PATH,
    component: Layout,
    routes: [
      ...detail,
      {
        path: '',
        component: DevopsListLayout,
        routes: [
          { path: `${PATH}/pipelines`, component: PipelinesList, exact: true },
          { path: `${PATH}/base-info`, component: BaseInfo, exact: true },
          { path: `${PATH}/roles`, component: Roles, exact: true },
          { path: `${PATH}/members`, component: Members, exact: true },
          { path: `${PATH}/credentials`, component: Credential, exact: true },
          getIndexRoute({ path: PATH, to: `${PATH}/pipelines`, exact: true }),
        ],
      },
      getIndexRoute({ path: '*', to: '/404', exact: true }),
    ],
  },
]
