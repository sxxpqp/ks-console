export const getLocalStorageItem = key => {
  const item = localStorage.getItem(key)
  try {
    const { expires, value } = JSON.parse(item)

    if (Date.now() > expires) {
      localStorage.removeItem(key)
      return null
    }

    return value
  } catch (e) {
    return item
  }
}

export const setLocalStorageItem = (key, value, maxAge = 86400) => {
  try {
    localStorage.setItem(
      key,
      JSON.stringify({
        expires: Date.now() + maxAge,
        value,
      })
    )
  } catch (e) {}
}
