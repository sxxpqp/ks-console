import React from 'react'
import { observer, inject } from 'mobx-react'
import { Loading } from '@kube-design/components'

import Banner from 'components/Cards/Banner'
import { renderRoutes } from 'utils/router.config'
import MonitoringStore from 'stores/monitoring/base'

import routes from './routes'

@inject('rootStore')
@observer
class ClusterStability extends React.Component {
  constructor(props) {
    super(props)

    const monitoringStore = new MonitoringStore({ cluster: this.cluster })
    this.props.rootStore.register('monitoring', monitoringStore)
  }

  get cluster() {
    return this.props.match.params.cluster
  }

  componentDidMount() {
    this.props.rootStore.monitoring.checkEtcd()
  }

  get routes() {
    return routes
      .filter(
        item =>
          !!item.title &&
          (!item.requireETCD || this.props.rootStore.monitoring.supportETCD)
      )
      .map(item => ({
        ...item,
        name: item.path.split('/').pop(),
      }))
  }

  render() {
    return (
      <Loading spinning={this.props.rootStore.monitoring.etcdChecking}>
        <>
          <Banner
            icon="linechart"
            title={t('Cluster Status Monitoring')}
            description={t('MONITORING_CLUSTER_DESC')}
            routes={this.routes}
            className="margin-b12"
          />
          {renderRoutes(routes)}
        </>
      </Loading>
    )
  }
}

export default ClusterStability
