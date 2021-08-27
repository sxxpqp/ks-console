import { get } from 'lodash'

export const getOverrides = (template, data, keys) => {
  const overrides = []
  if (!template || !data) {
    return overrides
  }

  keys.forEach(key => {
    const templateValue = get(template, key, {})
    const dataValue = get(data, key, {})
    if (JSON.stringify(templateValue) !== JSON.stringify(dataValue)) {
      overrides.push({
        path: `/${key.replace(/\./g, '/')}`,
        value: dataValue,
      })
    }
  })

  return overrides
}
