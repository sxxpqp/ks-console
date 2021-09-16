import { getIndexRoute } from 'utils/router.config'

import Events from './Events'

const PATH = '/workspaces/:workspace/repos/:repo_id'

export default [
  {
    path: `${PATH}/events`,
    title: 'Events',
    component: Events,
    exact: true,
  },
  getIndexRoute({ path: PATH, to: `${PATH}/events`, exact: true }),
]
