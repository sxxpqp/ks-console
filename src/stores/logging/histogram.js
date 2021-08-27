import { observable, action } from 'mobx'
import { assign, get } from 'lodash'

import LoggingStore from './index'

export default class LoggingHistogram extends LoggingStore {
  @observable
  startTime = 0

  @observable
  endTime = 0

  @observable
  interval = '15m'

  @observable
  histograms = []

  @observable
  logsCount = 0

  @action
  async fetch(params = {}) {
    const defaultParams = {
      operation: 'histogram',
      start_time: this.startTime,
      end_time: this.endTime,
      interval: this.interval,
    }

    const resp = await this.request(assign(defaultParams, params))

    this.histograms = get(resp, 'histogram.histograms', []) || []

    this.logsCount = get(resp, 'histogram.total', 0)
  }

  handleResult(resp) {
    return resp
  }
}
