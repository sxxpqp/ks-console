import { observer, inject } from 'mobx-react'
import { get } from 'lodash'

import ContainerMonitorStore from 'stores/monitoring/container'

import { Component as Base } from '../Detail/Monitoring'

const MetricTypes = {
  cpu_usage: 'container_cpu_usage',
  memory_usage: 'container_memory_usage_wo_cache',
}

class Monitorings extends Base {
  constructor(props) {
    super(props)

    this.monitorStore = new ContainerMonitorStore()
  }

  get podName() {
    return get(this.props.match, 'params.podName', '')
  }

  fetchData = params => {
    const { cluster, namespace, name } = this.store.detail
    this.monitorStore.fetchMetrics({
      cluster,
      namespace,
      container: name,
      podName: this.podName,
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
  ]
}

export default inject('rootStore', 'detailStore')(observer(Monitorings))
export const Component = Monitorings
