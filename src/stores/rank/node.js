import { observable } from 'mobx'
import Store from './index'

const sort_metric_options = [
  'node_cpu_utilisation',
  'node_load1',
  'node_memory_utilisation',
  'node_disk_size_utilisation',
  'node_disk_inode_utilisation',
  'node_pod_utilisation',
]

export const metrics_filter = [
  'node_cpu_utilisation',
  'node_cpu_usage',
  'node_cpu_total',

  'node_memory_utilisation',
  'node_memory_usage_wo_cache',
  'node_memory_total',

  'node_disk_size_utilisation',
  'node_disk_size_usage',
  'node_disk_size_capacity',

  'node_pod_utilisation',
  'node_pod_running_count',
  'node_pod_quota',

  'node_disk_inode_utilisation',
  'node_disk_inode_total',
  'node_disk_inode_usage',

  'node_load1$',
]

export default class NodeStore extends Store {
  @observable
  sort_metric_options = sort_metric_options

  @observable
  sort_metric = sort_metric_options[0]

  @observable
  metrics_filter = metrics_filter.join('|')

  resource = 'nodes'
}
