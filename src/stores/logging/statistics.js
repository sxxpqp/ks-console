import { observable, action } from 'mobx'
import { assign, get } from 'lodash'
import LoggingStore from './index'

export default class LoggingHistogram extends LoggingStore {
  @observable
  logsCount = 0

  @observable
  startTime = 0

  @observable
  namespaces = []

  @action
  async fetch(params = {}, maxAge) {
    const start_time = new Date(new Date().setHours(0, 0, 0, 0)).getTime()
    const end_time = new Date().getTime()
    const operation = 'statistics'
    const defaultParams = { operation, start_time, end_time }
    const requestParams = assign(defaultParams, params)

    const resp = await this.request(requestParams, 'get', maxAge)

    this.containersCount = get(resp, 'statistics.containers', 0)

    this.logsCount = get(resp, 'statistics.logs', 0)

    this.startTime = start_time

    this.namespaces = get(resp, 'statistics.namespaces', []) || []
  }

  handleResult(resp) {
    return resp
  }
}
