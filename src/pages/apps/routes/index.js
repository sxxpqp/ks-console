import { getIndexRoute } from 'utils/router.config'

import Home from '../containers/Home'
import AppDetail from '../containers/AppDetail'
import AppDeploy from '../containers/AppDeploy'

import Layout from '../containers/layout'
import StoreManage from '../containers/StoreManage'
import Categories from '../containers/Categories'
import Reviews from '../containers/Reviews'

// import detail from './detail'

const PATH = '/apps-manage'

export default [
  // ...detail,
  {
    path: PATH,
    component: Layout,
    routes: [
      {
        path: `${PATH}/store`,
        component: StoreManage,
        exact: true,
      },
      {
        path: `${PATH}/categories`,
        component: Categories,
        exact: true,
      },
      {
        path: `${PATH}/reviews/:type`,
        component: Reviews,
        exact: true,
      },
      getIndexRoute({ path: PATH, to: `${PATH}/store`, exact: true }),
      getIndexRoute({
        path: `${PATH}/reviews/`,
        to: `${PATH}/reviews/unprocessed`,
        exact: true,
      }),
      // getIndexRoute({ path: '*', to: '/404', exact: true }),
    ],
  },
  { path: '/apps', component: Home, exact: true },
  { path: '/apps/:appId', component: AppDetail, exact: true },
  { path: '/apps/:appId/deploy', component: AppDeploy, exact: true },
]
