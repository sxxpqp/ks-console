import React from 'react'
import { observer, inject } from 'mobx-react'

import { renderRoutes } from 'utils/router.config'

import Banner from 'components/Cards/Banner'

import routes from './routes'

@inject('rootStore')
@observer
class ResourceStatus extends React.Component {
  get routes() {
    return routes
      .filter(item => !!item.title)
      .map(item => ({
        ...item,
        name: item.path.split('/').pop(),
      }))
  }

  render() {
    return (
      <div>
        <Banner
          icon="linechart"
          title={t('Application Resources Monitoring')}
          description={t('MONITORING_APPLICATION_DESC')}
          routes={this.routes}
        />
        {renderRoutes(routes)}
      </div>
    )
  }
}

export default ResourceStatus
