import { getIndexRoute } from 'utils/router.config'

import SecretDetail from './SecretDetail'

export default path => [
  {
    path: `${path}/detail`,
    title: 'Detail',
    component: SecretDetail,
    exact: true,
  },
  getIndexRoute({ path, to: `${path}/detail`, exact: true }),
]
