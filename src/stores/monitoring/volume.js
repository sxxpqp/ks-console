import { omit } from 'lodash'
import Base from './base'

export default class VolumeMonitor extends Base {
  constructor(filters = {}) {
    super('volumes')

    this.filters = filters
  }

  fetchMetrics(params) {
    super.fetchMetrics({ ...this.filters, ...params })
  }

  getApi = ({ namespace, pvc = '' }) =>
    `${this.apiVersion}/namespaces/${namespace}/persistentvolumeclaims/${pvc}`

  handleParams = params => omit(params, ['namespace', 'pvc'])

  monitoringMetrics(
    params = {},
    pollingOps = {
      interval: 5000,
    }
  ) {
    this.fetchMetrics(params)

    return setInterval(() => {
      this.fetchMetrics({ ...params, autoRefresh: true })
    }, pollingOps.interval)
  }
}
