const TIME_UNIT_MS_MAP = {
  s: 1000,
  m: 1000 * 60,
  h: 1000 * 60 * 60,
  d: 1000 * 60 * 60 * 24,
  w: 1000 * 60 * 60 * 24 * 7,
}

export const splitDateString = function(date) {
  const [, count = 0, unit = 's'] = date.match(/(\d*)([a-zA-Z])/) || []
  return {
    count,
    unit,
  }
}

export const date2Ms = function(date) {
  const { count, unit } = splitDateString(date)
  return count * (TIME_UNIT_MS_MAP[unit] || 0)
}

export const dateI18n = function(date) {
  const { count, unit } = splitDateString(date)
  return t(`TIME_${unit.toUpperCase()}`, { num: count })
}

export const getLastTimeRange = function(date) {
  const now = Date.now()
  return {
    endTime: now,
    startTime: now - date2Ms(date),
  }
}
