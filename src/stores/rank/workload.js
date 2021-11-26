import { observable, action } from 'mobx'
import { get, assign } from 'lodash'
import { to } from 'utils'
import Store from './index'

const sort_metric_options = [
  'workload_cpu_usage',
  'workload_memory_usage_wo_cache',
  'workload_net_bytes_transmitted',
  'workload_net_bytes_received',
]

const metrics_filter = [
  'workload_cpu_usage',
  'workload_memory_usage_wo_cache',
  'workload_net_bytes_transmitted',
  'workload_net_bytes_received',
  'replica',
]

export default class WorkloadStore extends Store {
  @observable
  namespaces

  @observable
  sort_metric_options = sort_metric_options

  @observable
  sort_metric = sort_metric_options[0]

  @observable
  metrics_filter = metrics_filter.join('|')

  @observable
  namespacesArr = []

  get fetchUrl() {
    return `${this.apiVersion}/namespaces/${this.namespaces}/workloads`
  }

  fetchUrlParam(namespace) {
    return `${this.apiVersion}/namespaces/${namespace}/workloads`
  }

  @action
  changeNamespace = ns => {
    this.namespaces = ns
    this.fetchAll()
  }

  @action
  async fetchAllNameSpaces(params = {}) {
    this.data = []
    this.isLoading = true

    const defaultParams = {
      type: this.rankRequestTag,
      metrics_filter: this.metrics_filter,
      page: this.page,
      limit: this.limit,
      sort_type: this.sort_type,
      sort_metric: this.sort_metric || get(this, 'sort_metric_options.[0]'),
    }
    const data = []
    let total_page = 0
    for (let i = 0; i < this.namespacesArr.length; i++) {
      const result = await to(
        request.get(
          this.fetchUrlParam(this.namespacesArr[i]),
          assign(defaultParams, params)
        )
      )
      data.push(this.handleResult(result))
      total_page += result.total_page
    }

    this.total_page = total_page

    this.data = data

    this.isLoading = false

    return data
  }
}
