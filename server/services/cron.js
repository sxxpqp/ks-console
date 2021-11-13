/* eslint-disable no-console */
const { get } = require('lodash')
const CronJob = require('cron').CronJob
const axios = require('axios')
const qs = require('qs')
const { getServerConfig } = require('@/libs/utils')
const { getK8sNodes } = require('./platform')

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
    await getK8sNodes()
    console.log('update1')
  } catch (error) {
    console.log(error)
  }
})

// module.exports = { cronJob, getAccessToken, cronJob1, getNodeInfo }
