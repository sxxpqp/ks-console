import { get, has } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import isEqual from 'react-fast-compare'

import { getAreaChartOps } from 'utils/monitoring'
import { getMetricData, getSuccessCount } from 'utils/service'

import { SimpleArea as Chart } from 'components/Charts'
import TrafficCard from './TrafficCard'
import WorkloadSelect from './WorkloadSelect'

import styles from './index.scss'

export default class Monitors extends React.Component {
  static propTypes = {
    detail: PropTypes.object,
    store: PropTypes.object,
  }

  constructor(props) {
    super(props)

    this.state = {
      workload: get(props.detail, 'workloads[0].data.workload'),
      metrics: {},
      outMetrics: {},
    }

    this.getData()
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.detail, this.props.detail)) {
      this.setState(
        {
          workload: get(this.props.detail, 'workloads[0].data.workload'),
        },
        () => {
          this.getData()
        }
      )
    }
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.getData()
    }, 10000)
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  get store() {
    return this.props.store
  }

  get workloads() {
    return get(this.props.detail, 'workloads', []).map(item => ({
      label: get(item, 'data.workload', ''),
      value: get(item, 'data.workload', ''),
    }))
  }

  async getData() {
    const { workload } = this.state
    const { store } = this.props

    if (workload) {
      this.store
        .fetchWorkloadMetrics(
          {
            name: workload,
            namespace: store.detail.namespace,
            cluster: store.detail.cluster,
          },
          { duration: 1800 }
        )
        .then(metrics => {
          this.setState({ metrics })
        })
      this.store
        .fetchWorkloadMetrics(
          {
            name: workload,
            namespace: store.detail.namespace,
            cluster: store.detail.cluster,
          },
          {
            duration: 1800,
            direction: 'outbound',
            reporter: 'destination',
          }
        )
        .then(metrics => {
          this.setState({ outMetrics: metrics })
        })
    }
  }

  get requestInMetrics() {
    const { detail } = this.props
    if (!detail) {
      return []
    }

    const { metrics } = this.state
    const request_count = get(
      metrics,
      'metrics.request_count.matrix[0].values',
      []
    )
    const request_error_count = get(
      metrics,
      'metrics.request_error_count.matrix[0].values',
      []
    )
    const request_success_count = request_count.map((item, index) =>
      getSuccessCount(item, request_error_count[index])
    )

    return getAreaChartOps({
      title: 'traffic',
      legend: ['Success', 'All'],
      areaColors: ['#329dce', '#d8dee5'],
      data: [{ values: request_success_count }, { values: request_count }],
      unit: 'RPS',
    })
  }

  get requestOutMetrics() {
    const { detail } = this.props
    if (!detail) {
      return []
    }

    const { outMetrics } = this.state
    const request_count = get(
      outMetrics,
      'metrics.request_count.matrix[0].values',
      []
    )
    const request_error_count = get(
      outMetrics,
      'metrics.request_error_count.matrix[0].values',
      []
    )
    const request_success_count = request_count.map((item, index) =>
      getSuccessCount(item, request_error_count[index])
    )

    return getAreaChartOps({
      title: 'traffic',
      legend: ['Success', 'All'],
      areaColors: ['#329dce', '#d8dee5'],
      data: [{ values: request_success_count }, { values: request_count }],
      unit: 'RPS',
    })
  }

  get trafficInMetrics() {
    const { detail } = this.props
    if (!detail) {
      return []
    }

    const { metrics } = this.state
    const request_count = getMetricData(
      get(metrics, 'metrics.request_count.matrix[0].values', []),
      NaN
    )
    const request_error_count = getMetricData(
      get(metrics, 'metrics.request_error_count.matrix[0].values', []),
      0
    )
    const request_success_rate =
      request_count > 0
        ? ((request_count - request_error_count) * 100) / request_count
        : NaN

    let request_duration
    if (has(metrics, 'histograms.request_duration_millis')) {
      request_duration = getMetricData(
        get(
          metrics,
          'histograms.request_duration_millis["avg"].matrix[0].values',
          []
        ),
        NaN
      )
    } else {
      request_duration =
        getMetricData(
          get(
            metrics,
            'histograms.request_duration["avg"].matrix[0].values',
            []
          ),
          NaN
        ) * 1000
    }

    return [
      {
        title: 'Traffic',
        data: request_count.toFixed(2),
        unit: 'RPS',
        icon: 'changing-over',
      },
      {
        title: 'Success rate',
        data: request_success_rate.toFixed(2),
        icon: 'check',
        unit: '%',
      },
      {
        title: 'Duration',
        data: request_duration.toFixed(2),
        icon: 'timed-task',
        unit: 'ms',
      },
    ]
  }

  get trafficOutMetrics() {
    const { detail } = this.props
    if (!detail) {
      return []
    }

    const { outMetrics } = this.state
    const request_count = getMetricData(
      get(outMetrics, 'metrics.request_count.matrix[0].values', []),
      NaN
    )
    const request_error_count = getMetricData(
      get(outMetrics, 'metrics.request_error_count.matrix[0].values', []),
      0
    )
    const request_success_rate =
      request_count > 0
        ? ((request_count - request_error_count) * 100) / request_count
        : NaN

    let request_duration
    if (has(outMetrics, 'histograms.request_duration_millis')) {
      request_duration = getMetricData(
        get(
          outMetrics,
          'histograms.request_duration_millis["avg"].matrix[0].values',
          []
        ),
        NaN
      )
    } else {
      request_duration =
        getMetricData(
          get(
            outMetrics,
            'histograms.request_duration["avg"].matrix[0].values',
            []
          ),
          NaN
        ) * 1000
    }

    return [
      {
        title: 'Traffic',
        data: request_count.toFixed(2),
        unit: 'RPS',
        icon: 'changing-over',
      },
      {
        title: 'Success rate',
        data: request_success_rate.toFixed(2),
        icon: 'check',
        unit: '%',
      },
      {
        title: 'Duration',
        data: request_duration.toFixed(2),
        icon: 'timed-task',
        unit: 'ms',
      },
    ]
  }

  handleWorkloadChange = workload => {
    this.setState({ workload }, () => this.getData())
  }

  renderWorkloadSelect() {
    return (
      <WorkloadSelect
        className={styles.workloads}
        value={this.state.workload}
        options={this.workloads}
        onChange={this.handleWorkloadChange}
      />
    )
  }

  render() {
    return (
      <>
        <div className={styles.title}>
          {t('HTTP - Inbound Traffic')} {this.renderWorkloadSelect()}
        </div>
        <TrafficCard metrics={this.trafficInMetrics} />
        <div className="margin-b8" />
        <Chart {...this.requestInMetrics} height={150} />
        <div className={styles.title}>
          {t('HTTP - Outbound Traffic')} {this.renderWorkloadSelect()}
        </div>
        <TrafficCard metrics={this.trafficOutMetrics} />
        <div className="margin-b8" />
        <Chart {...this.requestOutMetrics} height={150} />
      </>
    )
  }
}
