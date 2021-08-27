import { computed } from 'mobx'
import { unitTransformMap, avgs } from 'utils/monitoring'
import { get } from 'lodash'

import Base from './monitor'

const NAME_VALUE_HANDLE_MAP = {
  avg: avgs,
  last(values) {
    return values[values.length - 1]
  },
  first(values) {
    return values[0]
  },
  max(values) {
    return Math.max.apply(null, values)
  },
  min(values) {
    return Math.min.apply(null, values)
  },
}

export default class GraphMonitor extends Base {
  @computed
  get graphData() {
    const dataTimeGroup = this.metrics.reduce((dataGroupByTime, metric) => {
      const { values, id } = metric

      values.forEach(([time, value]) => {
        const timestamp = time * 1000
        const dataInTime = dataGroupByTime[timestamp] || {}
        dataInTime[id] = Number(value)
        dataGroupByTime[timestamp] = dataInTime
      })

      return dataGroupByTime
    }, {})

    const data = Object.entries(dataTimeGroup).map(([time, message]) => ({
      time: Number(time),
      ...message,
    }))

    return data
  }

  @computed
  get legends() {
    const { colors = [] } = this.config
    return this.formattedMetrics.map((metric, index) => {
      const { id, name } = metric
      return {
        name,
        ID: id,
        color: colors[index % colors.length],
      }
    })
  }

  @computed
  get valueFormatter() {
    const format = get(this.config, 'yaxes[0].format', 'none')
    const decimals = get(this.config, 'yaxes[0].decimals', 2)
    const formatter = unitTransformMap[format] || function() {}
    return number => formatter(number, decimals)
  }

  @computed
  get stats() {
    return this.formattedMetrics.map((metric, index) => {
      const values = (metric.values || []).map(([, value]) => Number(value))
      const { colors = [] } = this.config
      const { id, name } = metric

      return {
        id,
        name,
        color: colors[index % colors.length],
        stat: {
          max: this.valueFormatter(NAME_VALUE_HANDLE_MAP.max(values)),
          min: this.valueFormatter(NAME_VALUE_HANDLE_MAP.min(values)),
          avg: this.valueFormatter(NAME_VALUE_HANDLE_MAP.avg(values)),
          last: this.valueFormatter(NAME_VALUE_HANDLE_MAP.last(values)),
        },
      }
    })
  }
}
