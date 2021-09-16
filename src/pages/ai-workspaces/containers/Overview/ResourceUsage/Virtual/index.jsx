import React from 'react'
import { observer, inject } from 'mobx-react'
import { get } from 'lodash'

import { Select } from '@kube-design/components'

import WorkspaceMonitorStore from 'stores/monitoring/workspace'

import { Component as Base } from 'clusters/containers/Monitor/Resource/Usage/Virtual'

const MetricTypes = {
  deployment_count: 'workspace_deployment_count',
  statefulset_count: 'workspace_statefulset_count',
  daemonset_count: 'workspace_daemonset_count',
  job_count: 'workspace_job_count',
  cronjob_count: 'workspace_cronjob_count',
  pvc_count: 'workspace_pvc_count',
  service_count: 'workspace_service_count',
  route_count: 'workspace_ingresses_extensions_count',
  pod_running_count: 'workspace_pod_running_count',
}

@inject('rootStore')
@observer
export default class VirtualResource extends Base {
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
      type: 'deployment',
      title: 'Deployments',
      legend: ['Deployments'],
      metricType: MetricTypes.deployment_count,
    },
    {
      type: 'statefulset',
      title: 'StatefulSets',
      legend: ['StatefulSets'],
      metricType: MetricTypes.statefulset_count,
    },
    {
      type: 'daemonset',
      title: 'DaemonSets',
      legend: ['DaemonSets'],
      metricType: MetricTypes.daemonset_count,
    },
    {
      type: 'job',
      title: 'Jobs',
      legend: ['Jobs'],
      metricType: MetricTypes.job_count,
    },
    {
      type: 'cronjob',
      title: 'CronJobs',
      legend: ['CronJobs'],
      metricType: MetricTypes.cronjob_count,
    },
    {
      type: 'pvc',
      title: 'Volumes',
      legend: ['Volumes'],
      metricType: MetricTypes.pvc_count,
    },
    {
      type: 'service',
      title: 'Services',
      legend: ['Services'],
      metricType: MetricTypes.service_count,
    },
    {
      type: 'routes',
      title: 'Routes',
      legend: ['Routes'],
      metricType: MetricTypes.route_count,
    },
    {
      type: 'pod',
      title: 'Pods',
      legend: ['Running Pods'],
      metricType: MetricTypes.pod_running_count,
    },
  ]

  getControllerProps = () => ({
    title: t('Application Resources Usage'),
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
