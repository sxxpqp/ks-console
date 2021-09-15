import { getIndexRoute } from 'utils/router.config'

import VersionManage from './VersionManage'
import AppInformation from './AppInformation'
import AuditRecord from './AuditRecord'
import AppInstances from './AppInstances'

const PATH = '/apps-manage/store/:appId'

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
