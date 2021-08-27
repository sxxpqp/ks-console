import React from 'react'
import { observer, inject } from 'mobx-react'
import { isEmpty, get } from 'lodash'

import { getAreaChartOps } from 'utils/monitoring'
import PodMonitorStore from 'stores/monitoring/pod'

import { Controller as MonitoringController } from 'components/Cards/Monitoring'
import { SimpleArea } from 'components/Charts'

const MetricTypes = {
  cpu_usage: 'pod_cpu_usage',
  memory_usage: 'pod_memory_usage_wo_cache',
  net_transmitted: 'pod_net_bytes_transmitted',
  net_received: 'pod_net_bytes_received',
}

class Monitorings extends React.Component {
  constructor(props) {
    super(props)

    this.monitorStore = new PodMonitorStore()
  }

  get store() {
    return this.props.detailStore
  }

  get metrics() {
    return this.monitorStore.data
  }

  fetchData = params => {
    const { cluster, namespace, name } = this.store.detail
    this.monitorStore.fetchMetrics({
      cluster,
      namespace,
      pod: name,
      metrics: Object.values(MetricTypes),
      ...params,
    })
  }

  getMonitoringCfgs = () => [
    {
      type: 'cpu',
      title: 'CPU Usage',
      unitType: 'cpu',
      legend: ['Usage'],
      data: get(this.metrics, `${MetricTypes.cpu_usage}.data.result`),
    },
    {
      type: 'memory',
      title: 'Memory Usage',
      unitType: 'memory',
      legend: ['Usage'],
      data: get(this.metrics, `${MetricTypes.memory_usage}.data.result`),
    },
    {
      type: 'bandwidth',
      title: 'Outbound Traffic',
      unitType: 'bandwidth',
      legend: ['Outbound'],
      data: get(this.metrics, `${MetricTypes.net_transmitted}.data.result`),
    },
    {
      type: 'bandwidth',
      title: 'Inbound Traffic',
      unitType: 'bandwidth',
      legend: ['Inbound'],
      data: get(this.metrics, `${MetricTypes.net_received}.data.result`),
    },
  ]

  render() {
    const { createTime } = this.store.detail
    const { isLoading, isRefreshing } = this.monitorStore
    const configs = this.getMonitoringCfgs()

    return (
      <MonitoringController
        createTime={createTime}
        onFetch={this.fetchData}
        loading={isLoading}
        refreshing={isRefreshing}
        isEmpty={isEmpty(this.metrics)}
      >
        {configs.map(item => {
          const config = getAreaChartOps(item)

          if (isEmpty(config.data)) return null

          return <SimpleArea key={item.title} width="100%" {...config} />
        })}
      </MonitoringController>
    )
  }
}

export default inject('rootStore', 'detailStore')(observer(Monitorings))
export const Component = Monitorings
