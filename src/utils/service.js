import { get, isEmpty } from 'lodash'
import { SERVICE_TYPES } from 'utils/constants'

export const getServiceType = item => {
  const specType = get(item, 'spec.type')
  const clusterIP = get(item, 'spec.clusterIP')
  const selector = get(item, 'spec.selector', {})

  let type = SERVICE_TYPES.VirtualIP
  if (specType === 'ClusterIP') {
    if (clusterIP === 'None' || clusterIP === '') {
      if (!isEmpty(selector)) {
        type = SERVICE_TYPES.Headless
      } else {
        type = SERVICE_TYPES.Unknown
      }
    }
  } else if (specType === 'ExternalName') {
    type = SERVICE_TYPES.ExternalName
  }

  return type
}

export const getServicePort = item => {
  let { protocol } = item
  if (item.name && item.name.indexOf('-') !== -1) {
    protocol = item.name.split('-')[0].toUpperCase()
  }

  return `${item.port}${
    item.targetPort ? `:${item.targetPort}` : ''
  }/${protocol}`
}

export const getMetricData = (values, defaultValue) => {
  if (values[values.length - 1]) {
    return Number(values[values.length - 1][1]) || defaultValue
  }

  return defaultValue
}

export const getSuccessCount = (total = [], error = []) => {
  const totalNum = Number(total[1]) || 0
  const errorNum = Number(error[1]) || 0

  return [total[0], totalNum > 0 ? totalNum - errorNum : NaN]
}

export const getSuccessRate = (total = [], error = []) => {
  const totalNum = Number(total[1]) || 0
  const errorNum = Number(error[1]) || 0

  return [
    total[0],
    totalNum > 0 ? ((totalNum - errorNum) / totalNum).toFixed(4) : NaN,
  ]
}

export const transfer = async text => {
  try {
    return await request.post('/transfer', {
      text,
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('🚀 ~ file: service.js ~ line 69 ~ error', error)
  }
}
