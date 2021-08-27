import { getIndexRoute } from 'utils/router.config'

import CredentialDetail from './detail'
import Activity from './activity'

const PATH =
  '/:workspace/clusters/:cluster/devops/:devops/credentials/:credential_id'

export default [
  {
    path: `${PATH}/detail`,
    title: 'Detail',
    component: CredentialDetail,
    exact: true,
  },
  {
    path: `${PATH}/activity`,
    title: 'Activity',
    component: Activity,
    exact: true,
  },
  getIndexRoute({ path: PATH, to: `${PATH}/detail`, exact: true }),
]
