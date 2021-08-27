import { observer, inject } from 'mobx-react'
import { get } from 'lodash'
import React from 'react'

import { Select } from '@kube-design/components'
import WorkspaceMonitorStore from 'stores/monitoring/workspace'

import { Component as Base } from 'clusters/containers/Monitor/Resource/Usage/Physical'

const MetricTypes = {
  cpu_usage: 'workspace_cpu_usage',
  memory_usage: 'workspace_memory_usage_wo_cache',
  disk_usage: 'workspace_disk_size_usage',
}

@inject('rootStore')
@observer
export default class PhysicalResource extends Base {
  componentDidUpdate(prevProps) {
    if (prevProps.cluster !== this.props.cluster) {
      this.fetchData()
    }
  }

  get workspace() {
    return this.props.workspace
  }

  get createTime() {
    return get(this.props.rootStore, 'workspace.detail.createTime')
  }

  init() {
    this.monitorStore = new WorkspaceMonitorStore()
  }

  getMonitoringCfgs = () => [
    {
      type: 'cpu',
      title: 'CPU Usage',
      unitType: 'cpu',
      legend: ['CPU'],
      metricType: MetricTypes.cpu_usage,
    },
    {
      type: 'memory',
      title: 'Memory Usage',
      unitType: 'memory',
      legend: ['Memory'],
      metricType: MetricTypes.memory_usage,
    },
  ]

  getControllerProps = () => ({
    title: t('Physical Resources Usage'),
    createTime: this.createTime,
    customAction: this.renderClusters(),
  })

  renderClusters() {
    const { workspace, cluster, ...clusterProps } = this.props
    if (clusterProps.options.length) {
      return <Select value={cluster} {...clusterProps} />
    }
  }

  fetchData = params => {
    this.monitorStore.cluster = this.props.cluster

    this.monitorStore.fetchMetrics({
      workspace: this.workspace,
      metrics: Object.values(MetricTypes),
      ...params,
    })
  }
}
