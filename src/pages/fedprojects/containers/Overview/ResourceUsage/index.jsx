import React from 'react'
import { inject, observer } from 'mobx-react'
import isEqual from 'react-fast-compare'
import { get } from 'lodash'
import { toJS } from 'mobx'

import { ICON_TYPES } from 'utils/constants'
import { startAutoRefresh, stopAutoRefresh } from 'utils/monitoring'
import OverviewStore from 'stores/overview'
import ProjectMonitorStore from 'stores/monitoring/project'

import {
  Select,
  Loading,
  RadioGroup,
  RadioButton,
} from '@kube-design/components'
import { Panel } from 'components/Base'

import AppResourceItem from './AppResourceItem'
import PhysicalResourceItem from './PhysicalResourceItem'

import styles from './index.scss'

const APP_RESOURCE_METRIC_TYPES = [
  'namespace_pod_count',
  'namespace_deployment_count',
  'namespace_statefulset_count',
  'namespace_daemonset_count',
  'namespace_job_count',
  'namespace_cronjob_count',
  'namespace_pvc_count',
  'namespace_service_count',
  'namespace_secret_count',
  'namespace_configmap_count',
  'namespace_ingresses_extensions_count',
  'namespace_s2ibuilder_count',
]

const PHYSICAL_RESOURCE_METRIC_TYPES = [
  'namespace_cpu_usage',
  'namespace_memory_usage_wo_cache',
]

@inject('rootStore')
@observer
class ResourceUsage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      resourceType: 'application',
      range: 43200,
    }

    this.overviewStore = new OverviewStore()
    this.appResourceMonitorStore = new ProjectMonitorStore()
    this.physicalResourceMonitorStore = new ProjectMonitorStore()

    this.fetchData()
  }

  componentDidUpdate(prevProps) {
    if (
      !isEqual(prevProps.match.params, this.props.match.params) ||
      this.props.cluster !== prevProps.cluster
    ) {
      this.fetchData()
    }
  }

  componentDidMount() {
    startAutoRefresh(this, {
      method: 'fetchMetrics',
      interval: 10000,
      leading: false,
    })
  }

  componentWillUnmount() {
    stopAutoRefresh(this)
  }

  get routing() {
    return this.props.rootStore.routing
  }

  get namespace() {
    return get(this.props.match, 'params.namespace')
  }

  get timeOptions() {
    return [
      { label: `${t('Last')} ${t('TIME_H', { num: 1 })}`, value: 3600 },
      { label: `${t('Last')} ${t('TIME_H', { num: 2 })}`, value: 7200 },
      { label: `${t('Last')} ${t('TIME_H', { num: 5 })}`, value: 18000 },
      { label: `${t('Last')} ${t('TIME_H', { num: 12 })}`, value: 43200 },
      { label: `${t('Last')} ${t('TIME_D', { num: 1 })}`, value: 86400 },
      { label: `${t('Last')} ${t('TIME_D', { num: 2 })}`, value: 172800 },
      { label: `${t('Last')} ${t('TIME_D', { num: 3 })}`, value: 259200 },
      { label: `${t('Last')} ${t('TIME_D', { num: 7 })}`, value: 604800 },
    ]
  }

  fetchData = (params = {}) => {
    this.fetchMetrics()
    this.overviewStore.fetchResourceStatus({
      ...params,
      ...this.props.match.params,
      cluster: this.props.cluster,
    })
  }

  fetchMetrics = params => {
    const { resourceType, range } = this.state
    if (resourceType === 'application') {
      this.appResourceMonitorStore.fetchMetrics({
        ...this.props.match.params,
        cluster: this.props.cluster,
        metrics: APP_RESOURCE_METRIC_TYPES,
        step: `${Math.floor(range / 10)}s`,
        times: 10,
        fillZero: true,
        ...params,
        autoRefresh: false,
      })
    } else {
      this.physicalResourceMonitorStore.fetchMetrics({
        ...this.props.match.params,
        cluster: this.props.cluster,
        metrics: PHYSICAL_RESOURCE_METRIC_TYPES,
        step: `${Math.floor(range / 40)}s`,
        times: 40,
        fillZero: true,
        ...params,
        autoRefresh: false,
      })
    }
  }

  getResourceData = () => {
    const { quota = {}, status = {} } = toJS(this.overviewStore.resource)
    const used = quota.used || {}

    return [
      {
        key: 'pods',
        icon: ICON_TYPES['pods'],
        name: 'Pods',
        num: used['count/pods'],
        warnNum: status.pods,
        metric: 'namespace_pod_count',
      },
      {
        key: 'deployments',
        icon: ICON_TYPES['deployments'],
        name: 'Deployments',
        routeName: 'deployments',
        num: used['count/deployments.apps'],
        warnNum: status.deployments,
        metric: 'namespace_deployment_count',
      },
      {
        key: 'statefulsets',
        icon: ICON_TYPES['statefulsets'],
        name: 'StatefulSets',
        routeName: 'statefulsets',
        num: used['count/statefulsets.apps'],
        warnNum: status.statefulsets,
        metric: 'namespace_statefulset_count',
      },
      {
        key: 'volumes',
        icon: ICON_TYPES['volumes'],
        name: 'Volumes',
        routeName: 'volumes',
        num:
          used.persistentvolumeclaims || used['count/persistentvolumeclaims'],
        warnNum: status['persistent-volume-claims'],
        metric: 'namespace_pvc_count',
      },
      {
        key: 'services',
        icon: ICON_TYPES['services'],
        name: 'Services',
        routeName: 'services',
        num: used['count/services'],
        metric: 'namespace_service_count',
      },
      {
        key: 'ingresses',
        icon: ICON_TYPES['ingresses'],
        name: 'Routes',
        routeName: 'ingresses',
        num: used['count/ingresses.extensions'],
        metric: 'namespace_ingresses_extensions_count',
      },
    ]
  }

  handleResouceTypeChange = resourceType => {
    this.setState({ resourceType }, () => {
      this.fetchMetrics()
    })
  }

  handleRangeChange = range => {
    this.setState({ range }, () => {
      this.fetchMetrics()
    })
  }

  clusterRenderer = option => `${t('Cluster')}: ${option.value}`

  renderApplicationResource() {
    const { isLoading } = toJS(this.overviewStore.resource)
    const {
      data: metrics,
      isLoading: isMetricsLoading,
      isRefreshing,
    } = this.appResourceMonitorStore
    const resources = this.getResourceData()

    return (
      <Loading spinning={isLoading}>
        <div className={styles.resources}>
          {resources
            .filter(item => !item.disabled)
            .map(item => (
              <AppResourceItem
                {...this.props.match.params}
                {...item}
                metrics={get(metrics, `${item.metric}.data.result`)}
                isMetricsLoading={isMetricsLoading || isRefreshing}
              />
            ))}
        </div>
      </Loading>
    )
  }

  renderPhysicalResource() {
    const {
      data: metrics,
      isLoading: isMetricsLoading,
      isRefreshing,
    } = this.physicalResourceMonitorStore
    const range =
      this.timeOptions.find(item => item.value === this.state.range) || {}

    return (
      <div>
        <PhysicalResourceItem
          type="cpu"
          title={`${t('CPU Usage')} (${range.label})`}
          metrics={get(metrics, `namespace_cpu_usage.data.result`)}
          isLoading={isMetricsLoading || isRefreshing}
          showDay={range.value >= 172800}
        />
        <PhysicalResourceItem
          type="memory"
          title={`${t('Memory Usage')} (${range.label})`}
          metrics={get(metrics, `namespace_memory_usage_wo_cache.data.result`)}
          isLoading={isMetricsLoading || isRefreshing}
          showDay={range.value >= 172800}
        />
      </div>
    )
  }

  renderHeader() {
    const { cluster, clusters, onClusterChange } = this.props
    return (
      <div className={styles.header}>
        <RadioGroup
          mode="button"
          value={this.state.resourceType}
          onChange={this.handleResouceTypeChange}
          size="small"
        >
          <RadioButton value="application">
            {t('Application Resources')}
          </RadioButton>
          <RadioButton value="physical">{t('Physical Resources')}</RadioButton>
        </RadioGroup>

        <Select
          className={styles.timeSelect}
          value={this.state.range}
          options={this.timeOptions}
          onChange={this.handleRangeChange}
        />
        <Select
          className={styles.cluster}
          value={cluster}
          options={clusters}
          onChange={onClusterChange}
          valueRenderer={this.clusterRenderer}
        />
      </div>
    )
  }

  render() {
    const { resourceType } = this.state
    return (
      <Panel className={styles.wrapper} title={t('Resource Status')}>
        {this.renderHeader()}
        {resourceType === 'application'
          ? this.renderApplicationResource()
          : this.renderPhysicalResource()}
      </Panel>
    )
  }
}

export default ResourceUsage
