const CONDITION_OPTIONS = [
  {
    label: '>',
    value: '>',
  },
  {
    label: '>=',
    value: '>=',
  },
  {
    label: '<',
    value: '<',
  },
  {
    label: '<=',
    value: '<=',
  },
]

export const SEVERITY_LEVEL = [
  {
    // type: 'error',
    type: 'critical',
    prefixIcon: 'information',
    color: {
      primary: '#fae7e5',
      secondary: '#ca2621',
    },
    label: 'Critical Alert',
    value: 'critical',
  },
  {
    type: 'error',
    prefixIcon: 'information',
    color: {
      primary: '#fae7e5',
      secondary: '#f5a623',
    },
    label: 'Error Alert',
    value: 'error',
  },
  {
    type: 'warning',
    prefixIcon: 'information',
    color: {
      primary: '#fae7e5',
      secondary: '#79879c',
    },
    label: 'Warning Alert',
    value: 'warning',
  },
]

export const getBaseRuleConfig = ({ condition = {}, thresholds = {} } = {}) => [
  {
    name: 'condition_type',
    options: CONDITION_OPTIONS,
    ...condition,
  },
  {
    type: 'number',
    name: 'thresholds',
    placeholder: 'Threshold',
    ...thresholds,
  },
]

export const BASE_RULE_CONFIG = getBaseRuleConfig({
  thresholds: {
    min: 0,
  },
})

export const PERCENT_RULE_CONFIG = getBaseRuleConfig({
  thresholds: {
    min: 0,
    max: 100,
    unit: '%',
    converter: value => value / 100,
  },
})

export const CPU_RULE_CONFIG = getBaseRuleConfig({
  thresholds: {
    unit: 'core',
    min: 0,
  },
})

export const MEMORY_RULE_CONFIG = getBaseRuleConfig({
  thresholds: {
    unit: 'Mi',
    min: 0,
    converter: value => value * 1024 ** 2,
  },
})

export const DISK_RULE_CONFIG = getBaseRuleConfig({
  thresholds: {
    unit: 'GB',
    min: 0,
    converter: value => value * 1000 ** 3,
  },
})

export const THROUGHPUT_RULE_CONFIG = getBaseRuleConfig({
  thresholds: {
    unit: 'KB/s',
    min: 0,
    converter: value => value * 1000,
  },
})

export const BANDWIDTH_RULE_CONFIG = getBaseRuleConfig({
  thresholds: {
    unit: 'Mbps',
    min: 0,
    converter: value => value * (1024 ** 2 / 8),
  },
})
