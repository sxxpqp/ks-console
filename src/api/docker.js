import axios from 'axios'

// 应用固化发布
export const saveDocker = params => axios.post('/saveDocker', params)

// 复制应用
export const copyApp = params => axios.post('/copyApp', params)
