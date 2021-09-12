import React from 'react'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import { get } from 'lodash'

import { ICON_TYPES } from 'utils/constants'
import ClusterMonitoringStore from 'stores/monitoring/cluster'

import { Columns, Column, Loading } from '@kube-design/components'
import { Card } from 'components/Base'
import Info from 'components/Cards/Info'

import styles from './index.scss'

@inject('rootStore')
@observer
export default class ResourceStatistics extends React.Component {
  constructor(props) {
    super(props)

    this.monitoringStore = new ClusterMonitoringStore({
      cluster: this.cluster,
    })
    this.fetchData()
  }

  get cluster() {
    return this.props.match.params.cluster
  }

  get routing() {
    return this.props.rootStore.routing
  }

  fetchData = () => {
    this.monitoringStore.fetchStatistics()
  }

  getLink = routeName => {
    const actions = globals.app.getActions({
      module: routeName,
      cluster: this.cluster,
    })
    if (actions.includes('view') || actions.includes('manage')) {
      return `/${routeName}`
    }
    return null
  }

  getMetrics = () => {
    const data = toJS(this.monitoringStore.statistics.data)
    const metrics = {}

    Object.entries(data).forEach(([key, value]) => {
      metrics[key] = get(value, 'data.result[0].value[1]', 0)
    })

    return metrics
  }

  render() {
    const { isLoading } = this.monitoringStore.statistics
    const metrics = this.getMetrics()

    return (
      <Loading spinning={isLoading}>
        <Card className={styles.card}>
          <Columns>
            <Column>
              <Info
                icon={ICON_TYPES['workspaces']}
                desc={t('Workspaces')}
                title={metrics.cluster_workspace_count}
                url={this.getLink('workspaces')}
                size="large"
              />
            </Column>
            <Column>
              <Info
                icon={ICON_TYPES['accounts']}
                desc={t('Accounts')}
                title={metrics.cluster_account_count}
                url={this.getLink('accounts')}
                size="large"
              />
            </Column>
            <Column>
              <Info
                icon={ICON_TYPES['projects']}
                desc={t('Projects')}
                title={metrics.cluster_namespace_count}
                url={this.getLink('projects')}
                size="large"
              />
            </Column>
            {globals.app.hasClusterModule(this.cluster, 'devops') && (
              <Column>
                <Info
                  icon={ICON_TYPES['devops']}
                  desc={t('DevOps Projects')}
                  title={metrics.cluster_devops_project_count}
                  size="large"
                />
              </Column>
            )}
          </Columns>
        </Card>
      </Loading>
    )
  }
}
