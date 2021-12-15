import axios from 'axios'
import { getServerConfig } from '../libs/utils'

const {
  server: { harbor },
} = getServerConfig()

const instance = axios.create({
  baseURL: `${harbor.url}`,
  headers: {
    Authorization: `Basic ${Buffer.from(
      `${harbor.username}:${harbor.password}`
    ).toString('base64')}`,
  },
})

instance.interceptors.request.use(
  config => {
    return config
  },
  err => {
    global.logError.error(err)
    return Promise.reject(err)
  }
)

export default instance
