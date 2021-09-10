import axios from 'axios'

// 申请资源
export const applyRes = params => axios.post('/apply', params)

// 获取申请列表
export const getApply = params => axios.get('/apply', params)

// 驳回&审批申请
export const updateApply = params => axios.put('/apply', params)

// 获取节点资源
export const getNodes = params => axios.get('/nodes', params)
