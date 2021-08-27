import { getChildRoutes } from 'utils/router.config'

import GrayReleaseLayout from '../containers/GrayRelease'
import Categories from '../containers/GrayRelease/Categories'
import Jobs from '../containers/GrayRelease/Jobs'

const PATH = '/:workspace/clusters/:cluster/projects/:namespace/grayrelease'

const ROUTES = [
  { name: 'cates', title: 'GRAY_RELEASE_CATEGORIES', component: Categories },
  { name: 'jobs', title: 'Job Status', component: Jobs },
]

export default [
  {
    path: PATH,
    component: GrayReleaseLayout,
    routes: getChildRoutes(ROUTES, PATH),
  },
]
