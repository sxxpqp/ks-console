import { getIndexRoute } from 'utils/router.config'

import AppInformation from 'apps/containers/StoreManage/Detail/AppInformation'
import AuditRecord from 'apps/containers/StoreManage/Detail/AuditRecord'
import VersionManage from './VersionManage'
import AppInstances from './AppInstances'

const PATH = '/workspaces/:workspace/apps/:appId'

export default [
  {
    path: `${PATH}/versions`,
    title: 'Versions',
    component: VersionManage,
    exact: true,
  },
  {
    path: `${PATH}/app-information`,
    title: 'App Information',
    component: AppInformation,
    exact: true,
  },
  {
    path: `${PATH}/audit-records`,
    title: 'Audit Records',
    component: AuditRecord,
    exact: true,
  },
  {
    path: `${PATH}/app-instances`,
    title: 'App Instances',
    component: AppInstances,
    exact: true,
  },
  getIndexRoute({ path: PATH, to: `${PATH}/versions`, exact: true }),
]
