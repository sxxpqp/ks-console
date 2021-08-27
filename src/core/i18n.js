import moment from 'moment-mini'
import { LocaleProvider } from '@kube-design/components'
import get from 'lodash/get'
import cookie from 'utils/cookie'
import { getBrowserLang } from 'utils'

const { locale } = LocaleProvider

const init = async () => {
  const userLang = get(globals.user, 'lang') || getBrowserLang()
  if (userLang && cookie('lang') !== userLang) {
    cookie('lang', userLang)
  }

  if (userLang === 'zh') {
    moment.locale('zh', {
      relativeTime: {
        s: '1秒',
        ss: '%d秒',
        m: '1分钟',
        mm: '%d分钟',
        h: '1小时',
        hh: '%d小时',
        d: '1天',
        dd: '%d天',
        M: '1个月',
        MM: '%d个月',
        y: '1年',
        yy: '%d年',
        past: '%s前',
        future: '在%s后',
      },
    })
  }

  const locales = {}
  const localePath = globals.localeManifest[`locale-${userLang}.json`]
  if (userLang && localePath) {
    const data = await request.get(`dist/${localePath}`)
    locales[userLang] = data
  }

  return { locales }
}

const t = (key, options) => {
  let value = key && locale.get(key, options)

  if (options && options.defaultValue && value === key) {
    value = options.defaultValue
  }

  return value
}

t.html = (key, options) => key && locale.getHTML(key, options)

export default {
  init,
  t,
}
