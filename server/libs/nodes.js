import {
  get,
  isEmpty,
  omit,
  trimEnd,
  isUndefined,
  isArray,
  isNaN,
  isNumber,
  isString,
  last,
} from 'lodash'

export const getResourceCreator = item =>
  get(item, 'metadata.annotations["kubesphere.io/creator"]') ||
  get(item, 'metadata.annotations.creator') ||
  ''

export const getDescription = item =>
  get(item, 'metadata.annotations["kubesphere.io/description"]') ||
  get(item, 'metadata.annotations.desc') ||
  ''

export const getAliasName = item =>
  get(item, 'metadata.annotations["kubesphere.io/alias-name"]') ||
  get(item, 'metadata.annotations.displayName') ||
  ''

export const getBaseInfo = item => ({
  uid: get(item, 'metadata.uid'),
  name: get(item, 'metadata.name'),
  creator: getResourceCreator(item),
  description: getDescription(item),
  aliasName: getAliasName(item),
  createTime: get(item, 'metadata.creationTimestamp'),
  resourceVersion: get(item, 'metadata.resourceVersion'),
  isFedManaged: get(item, 'metadata.labels["kubefed.io/managed"]') === 'true',
})

export const getNodeRoles = labels => {
  let roles = []

  if (!isEmpty(labels)) {
    roles = Object.keys(labels)
      .filter(key => key.startsWith('node-role.kubernetes.io/'))
      .map(key => key.replace('node-role.kubernetes.io/', ''))
  }

  return roles
}

export const getConditionsStatus = record => {
  if (record.status === 'Unknown') {
    return 'Warning'
  }

  switch (record.type) {
    case 'OutOfDisk':
      if (record.status === 'True') return 'Warning'
      break
    case 'MemoryPressure':
      if (record.status === 'True') return 'Warning'
      break
    case 'DiskPressure':
      if (record.status === 'True') return 'Warning'
      break
    case 'PIDPressure':
      if (record.status === 'True') return 'Warning'
      break
    case 'NetworkUnavailable':
      if (record.status === 'True') return 'Warning'
      break
    case 'ConfigOK':
      if (record.status === 'False') return 'Warning'
      break
    case 'KubeletReady':
      if (record.status === 'False') return 'Warning'
      break
    case 'Ready':
      if (record.status !== 'True') return 'Warning'
      break
    default:
      break
  }

  return 'Running'
}

export const getNodeStatus = ({ status = {}, spec = {}, importStatus }) => {
  if (importStatus && importStatus !== 'success') {
    return importStatus
  }

  const conditions = status.conditions || []
  let health = true

  if (spec.unschedulable) {
    return 'Unschedulable'
  }

  conditions.forEach(item => {
    health = getConditionsStatus(item) === 'Running'
  })

  return health ? 'Running' : 'Warning'
}

export const getOriginData = item =>
  omit(item, [
    'status',
    'metadata.uid',
    'metadata.selfLink',
    'metadata.generation',
    'metadata.ownerReferences',
    'metadata.resourceVersion',
    'metadata.creationTimestamp',
    'metadata.managedFields',
  ])

export const NodeMapper = item => ({
  ...getBaseInfo(item),
  labels: get(item, 'metadata.labels'),
  role: getNodeRoles(get(item, 'metadata.labels')),
  annotations: get(item, 'metadata.annotations'),
  status: get(item, 'status'),
  conditions: get(item, 'status.conditions'),
  nodeInfo: get(item, 'status.nodeInfo'),
  spec: get(item, 'spec'),
  unschedulable: get(item, 'spec.unschedulable'),
  importStatus: get(
    item,
    'metadata.labels["kubekey.kubesphere.io/import-status"]',
    'success'
  ),
  taints: get(item, 'spec.taints', []),
  ip:
    (get(item, 'status.addresses', []).find(a => a.type === 'InternalIP') || {})
      .address || '-',
  _originData: getOriginData(item),
})

export const getMetricValue = (lists, metric_name, node) => {
  const item = lists.find(i => i.metric_name === metric_name)
  const result = get(item, 'data.result')
  if (result && result.length > 0) {
    const data = result.find(i => i.metric.node === node)
    return get(data, 'value')[1]
  }
}

export const cpuFormat = (cpu, unit = 'Core') => {
  if (isUndefined(cpu) || cpu === null) {
    return cpu
  }

  const units = ['m', 'Core', 'k', 'M', 'G']
  const currentUnit = String(cpu).slice(-1)
  // if no unit, unit = 'Core'
  const currentUnitIndex =
    units.indexOf(currentUnit) > -1 ? units.indexOf(currentUnit) : 1
  const targetUnitIndex = units.indexOf(unit)

  let value =
    currentUnitIndex === 1
      ? Number(cpu)
      : Number(trimEnd(String(cpu), currentUnit))

  value *= 1000 ** (currentUnitIndex - targetUnitIndex)

  return Number(value.toFixed(3))
}

export const memoryFormat = (memory, unit = 'Mi') => {
  if (isUndefined(memory) || memory === null) {
    return memory
  }

  const units = ['ki', 'mi', 'gi', 'ti']
  const currentUnit = String(memory)
    .toLowerCase()
    .slice(-2)

  let currentUnitIndex =
    units.indexOf(currentUnit) > -1 ? units.indexOf(currentUnit) : 1
  const targetUnitIndex = units.indexOf(unit.toLowerCase())

  let value = Number(trimEnd(String(memory).toLowerCase(), currentUnit))

  if (/m$/g.test(String(memory))) {
    // transfer m to ki
    value = Number(trimEnd(String(memory), 'm')) / (1000 * 1024)
    currentUnitIndex = 0
  } else if (/^[0-9.]*$/.test(String(memory))) {
    // transfer bytes to ki
    value = Number(memory) / 1024
    currentUnitIndex = 0
  }

  value *= 1024 ** (currentUnitIndex - targetUnitIndex)

  if (String(value).indexOf('.') > -1) {
    value = Number(value.toFixed(3))
  }

  return value
}

export const UnitTypes = {
  second: {
    conditions: [0.01, 0],
    units: ['s', 'ms'],
  },
  cpu: {
    conditions: [0.1, 0],
    units: ['core', 'm'],
  },
  memory: {
    conditions: [1024 ** 4, 1024 ** 3, 1024 ** 2, 1024, 0],
    units: ['Ti', 'Gi', 'Mi', 'Ki', 'Bytes'],
  },
  disk: {
    conditions: [1000 ** 4, 1000 ** 3, 1000 ** 2, 1000, 0],
    units: ['TB', 'GB', 'MB', 'KB', 'Bytes'],
  },
  throughput: {
    conditions: [1000 ** 4, 1000 ** 3, 1000 ** 2, 1000, 0],
    units: ['TB/s', 'GB/s', 'MB/s', 'KB/s', 'B/s'],
  },
  traffic: {
    conditions: [1000 ** 4, 1000 ** 3, 1000 ** 2, 1000, 0],
    units: ['TB/s', 'GB/s', 'MB/s', 'KB/s', 'B/s'],
  },
  bandwidth: {
    conditions: [1024 ** 2 / 8, 1024 / 8, 0],
    units: ['Mbps', 'Kbps', 'bps'],
  },
  number: {
    conditions: [1000 ** 4, 1000 ** 3, 1000 ** 2, 1000, 0],
    units: ['T', 'G', 'M', 'K', ''],
  },
}

export const getSuitableUnit = (value, unitType) => {
  const config = UnitTypes[unitType]

  if (isEmpty(config)) return ''

  // value can be an array or a single value
  const values = isArray(value) ? value : [[0, Number(value)]]
  let result = last(config.units)
  config.conditions.some((condition, index) => {
    const triggered = values.some(
      _value =>
        ((isArray(_value) ? get(_value, '[1]') : Number(_value)) || 0) >=
        condition
    )

    if (triggered) {
      result = config.units[index]
    }
    return triggered
  })
  return result
}

export const getSuitableValue = (
  value,
  unitType = 'default',
  defaultValue = 0
) => {
  if ((!isNumber(value) && !isString(value)) || isNaN(Number(value))) {
    return defaultValue
  }

  const unit = getSuitableUnit(value, unitType)
  const unitText = unit ? ` ${t(unit)}` : ''
  const count = getValueByUnit(value, unit || unitType)
  return `${count}${unitText}`
}

export const getValueByUnit = (num, unit, precision = 2) => {
  let value = parseFloat(num)

  switch (unit) {
    default:
      break
    case '':
    case 'default':
      return value
    case 'iops':
      return Math.round(value)
    case '%':
      value *= 100
      break
    case 'm':
      value *= 1000
      if (value < 1) return 0
      break
    case 'Ki':
      value /= 1024
      break
    case 'Mi':
      value /= 1024 ** 2
      break
    case 'Gi':
      value /= 1024 ** 3
      break
    case 'Ti':
      value /= 1024 ** 4
      break
    case 'Bytes':
    case 'B':
    case 'B/s':
      break
    case 'K':
    case 'KB':
    case 'KB/s':
      value /= 1000
      break
    case 'M':
    case 'MB':
    case 'MB/s':
      value /= 1000 ** 2
      break
    case 'G':
    case 'GB':
    case 'GB/s':
      value /= 1000 ** 3
      break
    case 'T':
    case 'TB':
    case 'TB/s':
      value /= 1000 ** 4
      break
    case 'bps':
      value *= 8
      break
    case 'Kbps':
      value = (value * 8) / 1024
      break
    case 'Mbps':
      value = (value * 8) / 1024 / 1024
      break
    case 'ms':
      value *= 1000
      break
  }

  return Number(value) === 0 ? 0 : Number(value.toFixed(precision))
}
