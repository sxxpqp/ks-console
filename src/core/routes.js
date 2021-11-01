import Login from 'core/containers/Login'
import LoginConfirm from 'core/containers/LoginConfirm'
import PasswordConfirm from 'core/containers/PasswordConfirm'
import BaseLayout from 'core/layouts/Base'

import appStoreRoutes from 'ai-apps/routes/detail'
import { lazy } from 'react'

const AiPlatform = lazy(() =>
  import(/* webpackChunkName: "platform" */ 'ai-platform/App')
)
const Console = lazy(() =>
  import(/* webpackChunkName: "console" */ 'console/App')
)
const Clusters = lazy(() =>
  import(/* webpackChunkName: "clusters" */ 'clusters/App')
)
const Workspaces = lazy(() =>
  import(/* webpackChunkName: "workspaces" */ 'ai-workspaces/App')
)
const DevOps = lazy(() =>
  import(/* webpackChunkName: "devops" */ 'ai-devops/App')
)
const App = lazy(() => import(/* webpackChunkName: "apps" */ 'apps/App'))

export default [
  { path: `/login`, component: Login, exact: true },
  { path: `/login/confirm`, component: LoginConfirm, exact: true },
  { path: `/password/confirm`, component: PasswordConfirm, exact: true },
  {
    component: BaseLayout,
    routes: [
      {
        path: '/clusters',
        component: Clusters,
      },
      {
        path: '/:workspace/clusters/:cluster/projects/:namespace',
        component: AiPlatform,
      },
      {
        path: '/:workspace/clusters/:cluster/devops/:devops',
        component: DevOps,
      },
      {
        path: '/workspaces/:workspace',
        component: Workspaces,
      },
      {
        path: '/apps',
        component: App,
      },
      // 应用模板商店
      ...appStoreRoutes,
      {
        path: '*',
        component: Console,
      },
    ],
  },
]
