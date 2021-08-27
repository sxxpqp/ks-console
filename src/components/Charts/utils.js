export const getActiveSeries = (props = {}) => {
  const { xKey, data } = props
  return Object.keys(data[0] || {}).filter(key => key !== xKey)
}
