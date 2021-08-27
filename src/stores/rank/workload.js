import { observable, action } from 'mobx'
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

  get fetchUrl() {
    return `${this.apiVersion}/namespaces/${this.namespaces}/workloads`
  }

  @action
  changeNamespace = ns => {
    this.namespaces = ns
    this.fetchAll()
  }
}
