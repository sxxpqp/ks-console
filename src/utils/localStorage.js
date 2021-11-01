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

export const saveItem = (key, value) => {
  if (typeof value === 'string') {
    localStorage.setItem(key, value)
  } else {
    localStorage.setItem(key, JSON.stringify(value))
  }
}

export const getItem = key => {
  const item = localStorage.getItem(key)
  try {
    return JSON.parse(item)
  } catch (err) {
    return item
  }
}
