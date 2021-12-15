import axios from 'axios'

// 应用固化发布
export const saveDocker = params => axios.post('/ai/v1/saveDocker', params)

// 复制应用
export const copyApp = params => axios.post('/ai/v1/copyApp', params)
