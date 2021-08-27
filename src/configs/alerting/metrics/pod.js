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
  pod_cpu_usage: {
    label: 'cpu usage',
    prefixIcon: 'cpu',
    ruleConfig: CPU_RULE_CONFIG,
  },
  pod_cpu_utilisation: {
    label: 'cpu utilisation',
    prefixIcon: 'cpu',
    ruleConfig: PERCENT_RULE_CONFIG,
  },
  pod_memory_usage: {
    label: 'memory usage (including cache)',
    prefixIcon: 'memory',
    ruleConfig: MEMORY_RULE_CONFIG,
  },
  pod_memory_usage_wo_cache: {
    label: 'memory usage',
    prefixIcon: 'memory',
    ruleConfig: MEMORY_RULE_CONFIG,
  },
  pod_memory_utilisation: {
    label: 'memory utilisation (including cache)',
    prefixIcon: 'memory',
    ruleConfig: PERCENT_RULE_CONFIG,
  },
  pod_net_bytes_transmitted: {
    label: 'network data transmitting rate',
    prefixIcon: 'network',
    ruleConfig: BANDWIDTH_RULE_CONFIG,
  },
  pod_net_bytes_received: {
    label: 'network data receiving rate',
    prefixIcon: 'network',
    ruleConfig: BANDWIDTH_RULE_CONFIG,
  },
}
