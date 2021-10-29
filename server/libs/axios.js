import axios from 'axios'
import { getAccessToken } from '../services/cron'
import { getServerConfig } from './utils'

const serverConfig = getServerConfig().server

const instance = axios.create({
  baseURL: serverConfig.apiServer.url || 'http://test.bontor.cn:30881',
  timeout: 5000,
})

// 请求拦截器
instance.interceptors.request.use(
  async config => {
    const token = await getAccessToken()
    // 加入accessToken，请求k8s平台
    config.headers.Authorization = `Bearer ${token.access_token}`
    // console.log('🚀 ~ file: axios.js ~ line 18 ~ config', token.access_token)
    return config
  },
  err => {
    global.logError.error(err)
    return Promise.reject(err)
  }
)

instance.interceptors.response.use(
  res => {
    if (res.status === 200) {
      return res.data
    }
    return res
  },
  err => {
    global.logError.error(err)
    return Promise.reject(err)
  }
)

export default instance
