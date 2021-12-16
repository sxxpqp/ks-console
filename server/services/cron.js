/* eslint-disable no-console */
import { get } from 'lodash'
import { CronJob } from 'cron'
import axios from 'axios'
import qs from 'qs'
import { getServerConfig } from '../libs/utils'
import { getK8sNodes, getGPUstatus, getAlertsMsg } from './platform'

// 获取token任务
export const getAccessToken = async () => {
  const { setValue } = global.redis
  const config = getServerConfig().server
  const url = get(config, 'apiServer.url')
  const { kpiAdmin } = config
  const res = await axios.post(
    `${url}/oauth/token`,
    qs.stringify({
      ...kpiAdmin,
      grant_type: 'password',
      client_id: 'kubesphere',
      client_secret: 'kubesphere',
    }),
    {
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    }
  )
  if (res.status === 200) {
    const { access_token: accessToken, expires_in: expire } = res.data
    setValue('data', JSON.stringify(res.data), expire)
    setValue('token', accessToken, expire)
    return res.data
  }
  return res
}

export const cronJob = new CronJob('0 */30 * * * *', async () => {
  try {
    // const d = new Date()
    await getAccessToken()
    console.log('update token')
  } catch (error) {
    global.logError.error(error)
  }
})

export const cronJob1 = new CronJob('0 */1 * * * *', () => {
  try {
    // const d = new Date()
    // 每分钟获取节点信息
    getK8sNodes()
    getGPUstatus()
    getAlertsMsg()
  } catch (error) {
    console.log(error)
  }
})

// 每10分钟获取告警信息
// export const cronJob2 = new CronJob('0 */10 * * * *', async () => {
//   try {
//     await getK8sNodes()
//   } catch (error) {
//     console.log(error)
//   }
// })
