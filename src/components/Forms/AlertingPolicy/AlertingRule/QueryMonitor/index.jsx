import React, { Component } from 'react'
import { omit } from 'lodash'
import { MultiArea as Chart } from 'components/Charts'
import { formatDuration } from 'utils'
import { getAreaChartOps } from 'utils/monitoring'

export default class Monitoring extends Component {
  state = {
    metrics: [],
    id: '',
  }

  componentDidMount() {
    this.fetchMetrics()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.query !== this.props.query) {
      this.fetchMetrics()
    }
  }

  fetchMetrics = async params => {
    const { cluster, namespace, query, duration } = this.props
    const seconds = formatDuration(duration)
    const end = Math.floor(Date.now() / 1000)
    const start = end - seconds
    const result = await this.props.store.fetchMetric({
      expr: query,
      end,
      start,
      step: '30s',
      cluster,
      namespace,
      ...params,
    })
    this.setState({ metrics: result, id: query })
  }

  render() {
    const { id, metrics } = this.state
    const options = getAreaChartOps({
      height: 400,
      title: t('Alerting Monitoring'),
      data: metrics,
      legend: metrics.map(item =>
        item.metric ? JSON.stringify(omit(item.metric, '__name__')) : ''
      ),
    })
    return <Chart {...options} id={id} />
  }
}
