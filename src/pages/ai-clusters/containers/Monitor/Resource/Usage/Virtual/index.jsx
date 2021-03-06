import React from 'react'
import { observer, inject } from 'mobx-react'
import classnames from 'classnames'
import { isEmpty, isUndefined, get, omit } from 'lodash'

import { cacheFunc } from 'utils'
import { getAreaChartOps, getZeroValues } from 'utils/monitoring'
import ClusterMonitorStore from 'stores/monitoring/cluster'

import { Controller as MonitoringController } from 'components/Cards/Monitoring'
import { MediumArea } from 'components/Charts'
import ResourceMonitoringModal from 'components/Modals/Monitoring/ApplicationResource'

import styles from './index.scss'

const MetricTypes = {
  deployment_count: 'cluster_deployment_count',
  statefulset_count: 'cluster_statefulset_count',
  daemonset_count: 'cluster_daemonset_count',
  job_count: 'cluster_job_count',
  cronjob_count: 'cluster_cronjob_count',
  pvc_count: 'cluster_pvc_count',
  service_count: 'cluster_service_count',
  route_count: 'cluster_ingresses_extensions_count',
  pod_running_count: 'cluster_pod_running_count',
}

class VirtualResource extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showModal: false,
      selectItem: {},
    }

    this.init()
  }

  get metrics() {
    return this.monitorStore.data
  }

  get cluster() {
    return get(this.props, 'match.params.cluster')
  }

  init() {
    this.monitorStore = new ClusterMonitorStore({
      cluster: this.cluster,
    })
  }

  fetchData = params => {
    this.monitorStore.fetchMetrics({
      metrics: Object.values(MetricTypes),
      ...params,
    })
  }

  isEmptyData = data => {
    if (isEmpty(data)) return true

    const result = Object.values(data).every(item =>
      isEmpty(get(item, 'data.result'))
    )
    return result
  }

  showModal = config =>
    cacheFunc(
      `_showModal_${config.type}`,
      () => {
        if (this.props.workspace) {
          config.workspace = this.props.workspace
        }

        this.setState({
          showModal: true,
          selectItem: omit(config, ['data']),
        })
      },
      this
    )

  hideModal = () => {
    this.setState({
      showModal: false,
      selectItem: {},
    })
  }

  getControllerProps = () => ({})

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

  renderCard() {
    const { isLoading, isRefreshing } = this.monitorStore
    const configs = this.getMonitoringCfgs()

    return (
      <MonitoringController
        title={t('Application Resources Usage')}
        step="1h"
        times={24}
        onFetch={this.fetchData}
        loading={isLoading}
        refreshing={isRefreshing}
        isEmpty={this.isEmptyData(this.metrics)}
        {...this.getControllerProps()}
      >
        <div className={styles.content}>
          {configs.map(item => {
            const ops = {
              ...item,
              unit: '',
            }
            const itemEvent = isUndefined(item.onClick)
              ? this.showModal(ops)
              : item.onClick && item.onClick(ops)
            const itemData =
              get(this.metrics, `${item.metricType}.data.result`) || []
            const config = getAreaChartOps({
              ...ops,
              data: isEmpty(itemData)
                ? [{ values: getZeroValues() }]
                : itemData,
            })

            return (
              <div key={item.type} className={styles.wrapper}>
                <div
                  className={classnames(styles.item, {
                    [styles.cursor]: !!itemEvent,
                  })}
                  onClick={itemEvent}
                >
                  <MediumArea width="100%" height={100} {...config} />
                </div>
              </div>
            )
          })}
        </div>
      </MonitoringController>
    )
  }

  renderModal() {
    const { showModal, selectItem } = this.state

    return (
      <div>
        <ResourceMonitoringModal
          visible={showModal}
          detail={selectItem}
          cluster={this.cluster}
          workspace={this.workspace}
          workspaceStore={this.props.workspaceStore}
          onCancel={this.hideModal}
        />
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.renderCard()}
        {this.renderModal()}
      </div>
    )
  }
}

export default inject('rootStore')(observer(VirtualResource))
export const Component = VirtualResource
