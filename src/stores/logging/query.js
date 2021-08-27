import { observable, action, computed } from 'mobx'
import { assign, get } from 'lodash'
import { stringify } from 'qs'
import stripAnsi from 'strip-ansi'
import { getClusterUrl } from 'utils'

import LoggingStore from './index'

export default class LoggingQuery extends LoggingStore {
  @observable
  size = 10

  @observable
  from = 0

  @observable
  total = 0

  @observable
  records = []

  @observable
  log_query = ''

  @observable
  startTime = 0

  @observable
  endTime = 0

  @observable
  workspace = ''

  @observable
  pods = ''

  @observable
  containers = ''

  @action
  setQuery(query) {
    this.log_query = query
  }

  @computed
  get haveMore() {
    const { total, from, size } = this
    return total > from + size
  }

  @action
  async loadMoreLogs() {
    this.fetch(
      { ...this.preParams, from: this.from + this.size },
      { loadMore: true }
    )
  }

  async requestLogs(params) {
    return await this.request(params)
  }

  @action
  async fetch(params = {}, options = {}) {
    const defaultParams = {
      operation: 'query',
      start_time: this.startTime,
      end_time: this.endTime,
      log_query: this.log_query,
      pods: this.pods,
      sort: this.sort,
      containers: this.containers,
      from: this.from,
      size: this.size,
    }

    const queryParams = assign(defaultParams, params)

    const resp = await this.requestLogs(queryParams)

    const query = get(resp, 'query', {})

    const records = this.stripAnsiRecords(query.records)

    this.records = options.loadMore ? this.records.concat(records) : records

    this.workspace = resp.workspace

    this.total = query.total || 0

    this.from = queryParams.from

    this.size = queryParams.size

    this.preParams = queryParams
  }

  stripAnsiRecords(records = []) {
    return records.map(record => ({
      ...record,
      logStripANSI: stripAnsi(record.log),
    }))
  }

  exportLinkFactory({ cluster, start_time, end_time, ...rest }) {
    const api = getClusterUrl(this.getApiPath(cluster))

    return `/${api}?${stringify({
      sort: 'asc',
      ...rest,
      start_time: Math.floor(start_time / 1000),
      end_time: Math.floor(end_time / 1000),
      operation: 'export',
    })}`
  }
}
