import React from 'react'
import { observer, inject } from 'mobx-react'
import { isEmpty, get } from 'lodash'

import { ICON_TYPES } from 'utils/constants'
import { getAreaChartOps } from 'utils/monitoring'
import ComponentMonitorStore from 'stores/monitoring/component'

import { SimpleArea } from 'components/Charts'
import { StatusTabs } from 'components/Cards/Monitoring'
import TabItem from './Tab'

const MetricTypes = {
  request_latencies_total: 'apiserver_request_latencies',
  request_latencies_apis: 'apiserver_request_by_verb_latencies',
  request_rate: 'apiserver_request_rate',
  schedule_attempts_count: 'scheduler_schedule_attempts',
  schedule_attempt_rate: 'scheduler_schedule_attempt_rate',
}

@inject('rootStore')
@observer
export default class ServiceComponentStatusTab extends React.Component {
  constructor(props) {
    super(props)

    this.apiStore = new ComponentMonitorStore({
      module: 'apiserver',
      cluster: props.cluster,
    })
    this.schedulerStore = new ComponentMonitorStore({
      module: 'scheduler',
      cluster: props.cluster,
    })
  }

  get routing() {
    return this.props.rootStore.routing
  }

  get metrics() {
    const apiData = this.apiStore.data
    const schedulerData = this.schedulerStore.data
    return {
      ...apiData,
      ...schedulerData,
    }
  }

  fetchData = async (params = {}) => {
    const data = {
      step: '5m',
      times: 100,
      ...params,
    }

    await this.apiStore.fetchMetrics({
      metrics: [
        MetricTypes.request_latencies_total,
        MetricTypes.request_latencies_apis,
        MetricTypes.request_rate,
      ],
      ...data,
    })

    await this.schedulerStore.fetchMetrics({
      metrics: [
        MetricTypes.schedule_attempts_count,
        MetricTypes.schedule_attempt_rate,
      ],
      ...data,
    })
  }

  getSpecificData = (metricName, type, value) => {
    const data =
      get(this.metrics, `${MetricTypes[metricName]}.data.result`) || []
    return data.find(item => get(item, `metric.${type}`) === value) || {}
  }

  getVerbData = value =>
    this.getSpecificData('request_latencies_apis', 'verb', value)

  getTabOptions = () => {
    const result = [
      {
        icon: ICON_TYPES['apiserver'],
        name: 'APIServer',
        title: 'REQUEST_LATENCY',
      },
      {
        icon: ICON_TYPES['apiserver'],
        name: 'APIServer',
        title: 'REQUEST_RATE',
      },
      {
        icon: ICON_TYPES['scheduler'],
        name: 'Scheduler',
        title: 'ATTEMPT_FREQUENCY',
      },
      {
        icon: ICON_TYPES['scheduler'],
        name: 'Scheduler',
        title: 'ATTEMPT_RATE',
      },
    ]

    return result.map(item => ({
      props: item,
      component: TabItem,
    }))
  }

  getContentOptions = () => {
    const metrics = this.metrics
    const result = [
      {
        type: 'area',
        title: 'Request Latency',
        unit: 'ms',
        legend: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'TOTAL_AVERAGE'],
        data: [
          this.getVerbData('GET'),
          this.getVerbData('POST'),
          this.getVerbData('PATCH'),
          this.getVerbData('DELETE'),
          this.getVerbData('PUT'),
          get(metrics, `${MetricTypes.request_latencies_total}.data.result[0]`),
        ],
      },
      {
        type: 'area',
        title: 'Request Per Second',
        unit: 'times/s',
        legend: ['Request'],
        data: get(metrics, `${MetricTypes.request_rate}.data.result`),
      },
      {
        type: 'area',
        title: 'Attempt Frequency',
        unit: '',
        legend: ['SCHEDULED_SUCCESS', 'SCHEDULED_ERROR', 'SCHEDULED_FAIL'],
        data: [
          this.getSpecificData(
            'schedule_attempts_count',
            'result',
            'scheduled'
          ),
          this.getSpecificData('schedule_attempts_count', 'result', 'error'),
          this.getSpecificData(
            'schedule_attempts_count',
            'result',
            'unschedulable'
          ),
        ],
        areaColors: ['blue', 'red', 'yellow'],
      },
      {
        type: 'area',
        title: 'Attempt Rate',
        unit: 'times/s',
        legend: ['SCHEDULED_SUCCESS', 'SCHEDULED_ERROR', 'SCHEDULED_FAIL'],
        data: [
          this.getSpecificData('schedule_attempt_rate', 'result', 'scheduled'),
          this.getSpecificData('schedule_attempt_rate', 'result', 'error'),
          this.getSpecificData(
            'schedule_attempt_rate',
            'result',
            'unschedulable'
          ),
        ],
        areaColors: ['blue', 'red', 'yellow'],
      },
    ]

    return result.map(item => ({
      props: item,
      render: this.renderChart,
    }))
  }

  renderChart(option) {
    const commonProps = {
      key: option.title,
      width: '100%',
      height: '100%',
    }
    const config = getAreaChartOps(option)

    if (isEmpty(config.data)) return null

    switch (option.type) {
      default:
        return <SimpleArea {...commonProps} {...config} />
    }
  }

  render() {
    const { isLoading, isRefreshing } = this.schedulerStore

    return (
      <StatusTabs
        title={t('Service Component Monitoring')}
        tabOptions={this.getTabOptions()}
        contentOptions={this.getContentOptions()}
        loading={isLoading}
        refreshing={isRefreshing}
        onFetch={this.fetchData}
      />
    )
  }
}
