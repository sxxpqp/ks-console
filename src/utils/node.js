import { isEmpty } from 'lodash'

export const getNodeRoles = labels => {
  let roles = []

  if (!isEmpty(labels)) {
    roles = Object.keys(labels)
      .filter(key => key.startsWith('node-role.kubernetes.io/'))
      .map(key => key.replace('node-role.kubernetes.io/', ''))
  }

  return roles
}

export const NODE_CONDITION_ICONS = {
  Ready: 'templet',
  OutOfDisk: 'storage',
  PIDPressure: 'pie-chart',
  MemoryPressure: 'memory',
  DiskPressure: 'storage',
  NetworkUnavailable: 'earth',
  ConfigOK: 'record',
  KubeletReady: 'cluster',
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
