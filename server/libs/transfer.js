import axios from 'axios'
import qs from 'qs'

export const transfer = async text => {
  const arr = text.match(/.{1,5000}/g)
  const result = []

  for (const item of arr) {
    try {
      const r = await axios.post(
        `https://api-free.deepl.com/v2/translate`,
        qs.stringify({
          auth_key: global.server.auth_key,
          text: item,
          target_lang: 'ZH',
        }),
        {
          headers: {
            Host: 'api-free.deepl.com',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )
      // console.log(r.data)
      result.push(r.data.translations[0].text)
    } catch (error) {
      global.appError.error(`handlerTransfer error: ${error}`)
    }
  }

  return result.join('')
}
