import {
  getBaseRuleConfig,
  PERCENT_RULE_CONFIG,
  CPU_RULE_CONFIG,
  MEMORY_RULE_CONFIG,
} from './rule.config'

const BANDWIDTH_RULE_CONFIG = getBaseRuleConfig({
  thresholds: {
    unit: 'Kbps',
  },
})

export default {
  'namespace:workload_cpu_usage:sum{$1}': {
    label: 'cpu usage',
    prefixIcon: 'cpu',
    ruleConfig: CPU_RULE_CONFIG,
  },
  'namespace:workload_memory_usage:sum{$1}': {
    label: 'memory usage (including cache)',
    prefixIcon: 'memory',
    ruleConfig: MEMORY_RULE_CONFIG,
  },
  'namespace:workload_memory_usage_wo_cache:sum{$1}': {
    label: 'memory usage',
    prefixIcon: 'memory',
    ruleConfig: MEMORY_RULE_CONFIG,
  },
  'namespace:workload_net_bytes_transmitted:sum_irate{$1}': {
    label: 'network data transmitting rate',
    prefixIcon: 'network',
    ruleConfig: BANDWIDTH_RULE_CONFIG,
  },
  'namespace:workload_net_bytes_received:sum_irate{$1}': {
    label: 'network data receiving rate',
    prefixIcon: 'network',
    ruleConfig: BANDWIDTH_RULE_CONFIG,
  },
  'namespace:$2_unavailable_replicas:ratio{$1}': {
    label: 'Unavailable replicas ratio',
    prefixIcon: 'backup',
    ruleConfig: PERCENT_RULE_CONFIG,
  },
}
