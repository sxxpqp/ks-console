export const timeUnitAlias2MsMap = {
  s: 1000,
  m: 1000 * 60,
  h: 1000 * 60 * 60,
  d: 1000 * 60 * 60 * 24,
  w: 1000 * 60 * 60 * 24 * 7,
}

export const timeUnitAlias2CompleteTimeMap = {
  s: 'Seconds',
  m: 'Minutes',
  h: 'Hours',
  d: 'Days',
  w: 'Weeks',
}

/**
 * translate '10s' to '10 秒'
 * @param {string} timeAlias
 * @returns {string}
 */
export function translateTimeAlias(timeAlias) {
  try {
    const [, count, unit] = timeAlias.match(/^(\d+)([a-zA-Z])$/)
    return `${count} ${tranlateTimeUnitAlias(unit)}`
  } catch (e) {
    console.error(e)
    return 'invalid timeAlias format'
  }
}

/**
 * translate 's' to '秒’
 * @param {string} timeUnitAlias - format 's', 'm', 'h', 'd', 'w'
 */
export function tranlateTimeUnitAlias(timeUnitAlias) {
  return t(timeUnitAlias2CompleteTimeMap[timeUnitAlias]) || timeUnitAlias
}

export function getMsFromTimeAlias(timeAlias) {
  const { count, unit } = splitTimeAlias(timeAlias)
  return count * timeUnitAlias2MsMap[unit]
}

export function splitTimeAlias(timeAlias) {
  try {
    const [, count, unit] = timeAlias.match(/^(\d+)([a-zA-Z])$/)
    return {
      count,
      unit,
    }
  } catch (e) {
    return {
      count: 0,
      unit: 's',
    }
  }
}
