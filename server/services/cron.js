/* eslint-disable no-console */
import { get } from 'lodash'
import { CronJob } from 'cron'
import axios from 'axios'
import qs from 'qs'
import { getServerConfig } from '../libs/utils'
import { getK8sNodes } from './platform'

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

export const cronJob1 = new CronJob('0 */1 * * * *', async () => {
  try {
    // const d = new Date()
    // 每分钟获取节点信息
    console.log('update1')
    await getK8sNodes()
  } catch (error) {
    console.log(error)
  }
})

// module.exports = { cronJob, getAccessToken, cronJob1, getNodeInfo }
