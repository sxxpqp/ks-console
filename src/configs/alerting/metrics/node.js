import {
  BASE_RULE_CONFIG,
  PERCENT_RULE_CONFIG,
  DISK_RULE_CONFIG,
  THROUGHPUT_RULE_CONFIG,
  BANDWIDTH_RULE_CONFIG,
} from './rule.config'

export default {
  'node:pod_abnormal:ratio{$1}': {
    label: 'pod abnormal ratio',
    prefixIcon: 'pod',
    ruleConfig: PERCENT_RULE_CONFIG,
  },
  'node:pod_utilisation:ratio{$1}': {
    label: 'pod utilization rate',
    prefixIcon: 'pod',
    ruleConfig: PERCENT_RULE_CONFIG,
  },
  'node:node_cpu_utilisation:avg1m{$1}': {
    label: 'cpu utilization rate',
    prefixIcon: 'cpu',
    ruleConfig: PERCENT_RULE_CONFIG,
  },
  'node:load1:ratio{$1}': {
    label: 'load1',
    prefixIcon: 'cpu',
    ruleConfig: BASE_RULE_CONFIG,
  },
  'node:load5:ratio{$1}': {
    label: 'load5',
    prefixIcon: 'cpu',
    ruleConfig: BASE_RULE_CONFIG,
  },
  'node:load15:ratio{$1}': {
    label: 'load15',
    prefixIcon: 'cpu',
    ruleConfig: BASE_RULE_CONFIG,
  },
  'node:node_memory_bytes_available:sum{$1}': {
    label: 'memory available',
    prefixIcon: 'memory',
    ruleConfig: DISK_RULE_CONFIG,
  },
  'node:node_memory_utilisation:{$1}': {
    label: 'memory utilization rate',
    prefixIcon: 'memory',
    ruleConfig: PERCENT_RULE_CONFIG,
  },
  'node:disk_space_available:{$1}': {
    label: 'disk space available',
    prefixIcon: 'storage',
    ruleConfig: DISK_RULE_CONFIG,
  },
  'node:disk_space_utilization:ratio{$1}': {
    label: 'local disk space utilization rate',
    prefixIcon: 'storage',
    ruleConfig: PERCENT_RULE_CONFIG,
  },
  'node:disk_inode_utilization:ratio{$1}': {
    label: 'inode utilization rate',
    prefixIcon: 'storage',
    ruleConfig: PERCENT_RULE_CONFIG,
  },
  'node:data_volume_iops_reads:sum{$1}': {
    label: 'disk read iops',
    prefixIcon: 'storage',
    ruleConfig: BASE_RULE_CONFIG,
  },
  'node:data_volume_iops_writes:sum{$1}': {
    label: 'disk write iops',
    prefixIcon: 'storage',
    ruleConfig: BASE_RULE_CONFIG,
  },
  'node:data_volume_throughput_bytes_read:sum{$1}': {
    label: 'disk read throughput',
    prefixIcon: 'storage',
    ruleConfig: THROUGHPUT_RULE_CONFIG,
  },
  'node:data_volume_throughput_bytes_written:sum{$1}': {
    label: 'disk write throughput',
    prefixIcon: 'storage',
    ruleConfig: THROUGHPUT_RULE_CONFIG,
  },
  'node:node_net_bytes_transmitted:sum_irate{$1}': {
    label: 'network data transmitting rate',
    prefixIcon: 'network',
    ruleConfig: BANDWIDTH_RULE_CONFIG,
  },
  'node:node_net_bytes_received:sum_irate{$1}': {
    label: 'network data receiving rate',
    prefixIcon: 'network',
    ruleConfig: BANDWIDTH_RULE_CONFIG,
  },
}
