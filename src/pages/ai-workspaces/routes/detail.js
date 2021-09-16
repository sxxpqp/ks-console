import MemberDetail from '../containers/Members/Detail'
import RoleDetail from '../containers/Roles/Detail'
import AppDetail from '../containers/Apps/Detail'
import RepoDetail from '../containers/Repos/Detail'

const PATH = '/workspaces/:workspace'

export default [
  {
    path: `${PATH}/members/:name`,
    component: MemberDetail,
  },
  {
    path: `${PATH}/roles/:name`,
    component: RoleDetail,
  },
  {
    path: `${PATH}/apps/:appId`,
    component: AppDetail,
  },
  {
    path: `${PATH}/repos/:repo_id`,
    component: RepoDetail,
  },
]
