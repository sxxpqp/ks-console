import React, { Component } from 'react'
import { omit } from 'lodash'
import { Button, Loading } from '@kube-design/components'
import { MultiArea as Chart } from 'components/Charts'
import { getAreaChartOps } from 'utils/monitoring'
import TimeSelector from 'components/Cards/Monitoring/Controller/TimeSelector'
import { getMinuteValue, getTimeRange } from 'stores/monitoring/base'

import styles from './index.scss'

export default class Monitoring extends Component {
  state = {
    metrics: [],
    step: '30s',
    times: 60,
    isLoading: true,
  }

  componentDidMount() {
    this.fetchMetrics()
  }

  fetchMetrics = async params => {
    const { step, times } = this.state

    this.setState({ isLoading: true })

    const { query, cluster, namespace } = this.props.detail || {}
    const { start, end } = getTimeRange({ step, times })

    const result = await this.props.store.fetchMetric({
      expr: query,
      end,
      start,
      step,
      cluster,
      namespace,
      ...params,
    })
    this.setState({ metrics: result, times, step, isLoading: false })
  }

  handleChange = params => {
    const { step, times } = params
    this.setState({ step: getMinuteValue(step), times }, () => {
      this.fetchMetrics()
    })
  }

  render() {
    const { metrics } = this.state
    const { times, step, isLoading } = this.state
    const options = getAreaChartOps({
      height: 500,
      title: t('Alerting Monitoring'),
      data: metrics,
      legend: metrics.map(item =>
        item.metric ? JSON.stringify(omit(item.metric, '__name__')) : ''
      ),
    })
    return (
      <div className={styles.monitoring}>
        <div className={styles.bar}>
          <TimeSelector
            step={step}
            times={times}
            onChange={this.handleChange}
          />
          <Button
            type="control"
            icon="refresh"
            iconType="light"
            onClick={this.fetchMetrics}
          />
        </div>
        <Loading spinning={isLoading}>
          <Chart {...options} />
        </Loading>
      </div>
    )
  }
}
