import React from 'react'
import { observer, inject } from 'mobx-react'
import classnames from 'classnames'
import { isEmpty, get } from 'lodash'

import { getAreaChartOps } from 'utils/monitoring'
import WorkspaceMonitorStore from 'stores/monitoring/workspace'

import { Loading } from '@kube-design/components'
import { Card } from 'components/Base'
import { SimpleArea } from 'components/Charts'

import styles from './index.scss'

const MetricTypes = {
  namespace_count: 'cluster_namespace_count',
}

@inject('rootStore')
@observer
export default class ProjectTrend extends React.Component {
  constructor(props) {
    super(props)

    this.monitorStore = new WorkspaceMonitorStore({
      cluster: props.match.params.cluster,
    })
    this.fetchData()
  }

  get metrics() {
    return this.monitorStore.data
  }

  fetchData = (params = {}) => {
    this.monitorStore.fetchMetrics({
      metrics: Object.values(MetricTypes),
      step: '60m',
      times: 100,
      ...params,
    })
  }

  renderChart() {
    const config = getAreaChartOps({
      title: 'Projects Change Trend',
      unit: '',
      legend: ['Projects Count'],
      data: get(this.metrics, `${MetricTypes.namespace_count}.data.result`),
    })

    if (isEmpty(config.data)) return null

    return <SimpleArea width="100%" bgColor="transparent" {...config} />
  }

  render() {
    const { isLoading, isRefreshing } = this.monitorStore
    const empty = isEmpty(this.metrics)

    return (
      <Loading spinning={isLoading}>
        <Card
          className={classnames(styles.card, {
            [styles.empty]: empty,
          })}
          refreshing={isRefreshing}
          empty={t('NO_RESOURCE', { resource: t('Monitoring Data') })}
        >
          {this.renderChart()}
        </Card>
      </Loading>
    )
  }
}
