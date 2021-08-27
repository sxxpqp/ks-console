import { observable } from 'mobx'
import Store from './index'

const sort_metric_options = [
  'workspace_cpu_usage',
  'workspace_memory_usage_wo_cache',
  'workspace_pod_count',
  'workspace_net_bytes_transmitted',
  'workspace_net_bytes_received',
]

const metrics_filter = [
  'workspace_memory_usage_wo_cache',
  'workspace_pod_count',
  'workspace_cpu_usage',
  'workspace_net_bytes_transmitted',
  'workspace_net_bytes_received',
]

export default class WorkspaceStore extends Store {
  @observable
  sort_metric_options = sort_metric_options

  @observable
  sort_metric = sort_metric_options[0]

  @observable
  metrics_filter = metrics_filter.join('|')

  resource = 'workspaces'
}
