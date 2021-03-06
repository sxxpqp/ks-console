const IEContentLoaded = (w, callback) => {
  const d = w.document
  let done = false
  const init = () => {
    if (!done) {
      done = true
      callback()
    }
  }
  const polling = () => {
    try {
      d.documentElement.doScroll('left')
    } catch (e) {
      setTimeout(polling, 50)
      return
    }
    init()
  }
  polling()
  d.onreadystatechange = () => {
    if (d.readyState === 'complete') {
      d.onreadystatechange = null
      init()
    }
  }
}

const DOMReady = fn => {
  if (document.addEventListener) {
    if (
      ['complete', 'loaded', 'interactive'].indexOf(document.readyState) > -1
    ) {
      setTimeout(fn, 0)
    } else {
      const loadFn = () => {
        document.removeEventListener('DOMContentLoaded', loadFn, false)
        fn()
      }
      document.addEventListener('DOMContentLoaded', loadFn, false)
    }
  } else if (document.attachEvent) {
    IEContentLoaded(window, fn)
  }
}

export default DOMReady
