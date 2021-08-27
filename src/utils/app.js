import { capitalize } from 'lodash'

import cookie from 'utils/cookie'
import { STATUS_TRANSFER_MAP } from 'configs/openpitrix/version'

export const transferAppStatus = status => {
  if (cookie('lang') === 'zh') {
    if (status === 'draft') {
      return 'developing'
    }
    return STATUS_TRANSFER_MAP[status] || status
  }
  return status
}

export const transferVersionStatus = status => {
  if (cookie('lang') === 'zh') {
    return STATUS_TRANSFER_MAP[status] || status
  }
  return status
}

export const transferReviewStatus = status => {
  let transStatus
  switch (status) {
    case 'submitted':
      transStatus = 'pending-review'
      break
    case 'passed':
    case 'suspended':
    case 'rejected':
      transStatus = status
      break
    case 'active':
      transStatus = 'published'
      break
    default:
      transStatus = 'in-review'
  }

  return transStatus
}

export const getVersionTypesName = typeStr => {
  if (!typeStr) {
    return '-'
  }

  const types = typeStr.split(',')
  return types.map(type => capitalize(type)).join(' ')
}

export const getAppCategoryNames = categories => {
  const names = []
  categories.forEach(({ category_id, name, status }) => {
    if (category_id && status !== 'disabled') {
      const result =
        category_id === 'ctg-uncategorized' ? t('Uncategorized') : name
      names.push(t(result || category_id))
    }
  })

  return names.length ? names.join(', ') : '-'
}

export const downloadFileFromBase64 = (base64Str = '', fileName) => {
  const a = document.createElement('a')
  a.href = `data:application/tar+gzip;base64,${base64Str}`
  a.download = `${fileName}.tgz`
  a.click()
}

export const compareVersion = (v1, v2) => {
  if (typeof v1 + typeof v2 !== 'stringstring') {
    return false
  }

  const a = v1.split('.')
  const b = v2.split('.')
  const len = Math.max(a.length, b.length)

  for (let i = 0; i < len; i++) {
    if (
      (a[i] && !b[i] && parseInt(a[i], 10) > 0) ||
      parseInt(a[i], 10) > parseInt(b[i], 10)
    ) {
      return 1
    }
    if (
      (b[i] && !a[i] && parseInt(b[i], 10) > 0) ||
      parseInt(a[i], 10) < parseInt(b[i], 10)
    ) {
      return -1
    }
  }

  return 0
}

export const checkRepoInvalidReason = errCode => {
  const errReason = {
    // 901: '', // ErrNotExpect
    // 101: '', // ErrVisibility
    102: 'Unrecognized URL', // ErrNotUrl
    103: 'Invalid format of credential', // ErrCredentialNotJson
    104: 'Missing access key ID', // ErrNoAccessKeyId
    105: 'Missing secret access key', // ErrNoSecretAccessKey
    106: 'S3 access denied', // ErrS3AccessDeny
    107: 'Invalid format of URL', // ErrUrlFormat
    108: 'Invalid HTTP Scheme', // ErrSchemeNotHttp
    109: 'HTTP access denied', // ErrHttpAccessDeny
    110: 'Invalid HTTPS Scheme', // ErrSchemeNotHttps
    111: 'Invalid type', // ErrType
    112: 'Invalid Providers', // ErrProviders
    113: 'Invalid Repo URL', // ErrNotRepoUrl
    114: 'Invalid S3 Scheme', // ErrSchemeNotS3
    // 115: 'Bad Index YAML', // ErrBadIndexYaml
  }
  return t(errReason[errCode] || 'Invalid URL')
}
