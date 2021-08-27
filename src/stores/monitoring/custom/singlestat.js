import { get } from 'lodash'
import { computed } from 'mobx'
import { avgs, unitTransformMap } from 'utils/monitoring'

import Base from './monitor'

const NAME_VALUE_HANDLE_MAP = {
  avg: avgs,
  last(values) {
    return values[values.length - 1]
  },
  first(values) {
    return values[0]
  },
}

export default class SinglestatMonitor extends Base {
  /**
   * value that user wanne
   *
   * @return stinrg
   */
  @computed
  get stat() {
    const { valueName, decimals = 0, format: unitFormat } = this.config
    const { metrics } = this
    const metricsLength = this.metrics.length

    if (metricsLength > 1) {
      return 'Only queries that return single series/table is supported'
    }

    if (metricsLength === 0) {
      return 'No Data'
    }

    /**
     * values: number[]
     */
    const values = get(metrics, '0.values', []).map(([, value]) =>
      Number(value)
    )

    const handler = NAME_VALUE_HANDLE_MAP[valueName] || avgs
    const number = handler(values) || 0
    const format = unitTransformMap[unitFormat] || unitTransformMap.none
    return format(number, decimals)
  }
}
