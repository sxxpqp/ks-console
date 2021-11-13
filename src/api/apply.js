// import axios from 'axios'

// 申请资源
export const applyRes = params => request.post('/apply', params)

// 获取申请列表历史
export const getApply = params => request.get('/apply', params)

// 获取申请列表历史
export const getApplyHisAll = params => request.get('/applyhis', params)

// 驳回&审批申请
export const updateApply = params => request.put('/apply', params)

// 获取用户申请资源 (指定用户的所有申请资源)
export const getResources = params => request.get('/resource', params)

// 获取节点资源
export const getGroupResources = params =>
  request.get('/group-resource', params)

// 获取节点资源模板
export const getResourceTemplate = params =>
  request.get('/resources-template', params)

// 添加节点资源模板
export const addResourceTemplate = params =>
  request.post('/resources-template', params)

// 编辑节点资源模板
export const editResourceTemplate = params =>
  request.post('/edit-resources-template', params)

// 删除节点资源模板
export const removeResourceTemplate = id =>
  request.delete(`/resources-template/${id}`)
