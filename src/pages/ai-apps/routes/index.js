// import { getIndexRoute } from 'utils/router.config'

import Home from '../containers/Home'
import AppDetail from '../containers/AppDetail'
import AppDeploy from '../containers/AppDeploy'

// import Layout from '../containers/layout'
// import StoreManage from '../containers/StoreManage'

// import Reviews from '../containers/Reviews'

// import detail from './detail'

// const PATH = '/apps-manage'
const PATH = '/:workspace/clusters/:cluster/projects/:namespace'

export default [
  // ...detail,
  // {
  //   path: PATH,
  //   component: Layout,
  //   routes: [
  //     {
  //       path: `${PATH}/store`,
  //       component: StoreManage,
  //       exact: true,
  //     },

  //     {
  //       path: `${PATH}/reviews/:type`,
  //       component: Reviews,
  //       exact: true,
  //     },
  //     getIndexRoute({ path: PATH, to: `${PATH}/store`, exact: true }),
  //     getIndexRoute({
  //       path: `${PATH}/reviews/`,
  //       to: `${PATH}/reviews/unprocessed`,
  //       exact: true,
  //     }),
  //     getIndexRoute({ path: '*', to: '/404', exact: true }),
  //   ],
  // },
  { path: `${PATH}/apps`, component: Home, exact: true },
  { path: `${PATH}/apps/:appId`, component: AppDetail, exact: true },
  { path: `${PATH}/apps/:appId/deploy`, component: AppDeploy, exact: true },
]
