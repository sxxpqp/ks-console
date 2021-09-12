import { inject } from 'mobx-react'
import { renderRoutes } from 'utils/router.config'

import actions from './actions'
import routes from './routes'

const App = ({ rootStore }) => {
  rootStore.registerActions(actions)
  return renderRoutes(routes)
}

export default inject('rootStore')(App)
