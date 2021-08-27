import { getIndexRoute } from 'utils/router.config'

import ConfigDetail from './ConfigDetail'

export default path => [
  {
    path: `${path}/detail`,
    title: 'Detail',
    component: ConfigDetail,
    exact: true,
  },
  getIndexRoute({ path, to: `${path}/detail`, exact: true }),
]
