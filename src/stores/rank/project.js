import { observable, action } from 'mobx'
import Store from './index'

const sort_metric_options = [
  'namespace_cpu_usage',
  'namespace_memory_usage_wo_cache',
  'namespace_pod_count',
  'namespace_net_bytes_received',
  'namespace_net_bytes_transmitted',
]

const metrics_filter = [
  'namespace_memory_usage_wo_cache',
  'namespace_memory_limit_hard',

  'namespace_cpu_usage',
  'namespace_cpu_limit_hard',

  'namespace_pod_count',
  'namespace_pod_count_hard',

  'namespace_net_bytes_received',
  'namespace_net_bytes_transmitted',
]

export default class ProjectStore extends Store {
  @observable
  sort_metric_options = sort_metric_options

  @observable
  sort_metric = sort_metric_options[0]

  @observable
  metrics_filter = metrics_filter.join('|')

  get fetchUrl() {
    if (this.workspace) {
      return `${this.apiVersion}/workspaces/${this.workspace}/namespaces`
    }
    return `${this.apiVersion}/namespaces`
  }

  @action
  changeWorkSpace = ws => {
    this.workspace = ws
    this.fetchAll()
  }
}
