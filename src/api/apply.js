// import axios from 'axios'
// 获取申请列表历史
export const getApply = params => request.get('/ai/v1/apply', params)

// 申请资源
export const applyRes = params => request.post('/ai/v1/apply', params)

// 获取申请列表历史
export const getApplyHisAll = params => request.get('/ai/v1/applyhis', params)

// 驳回&审批申请
export const updateApply = params => request.put('/ai/v1/apply', params)

// 获取用户申请资源 (指定用户的所有申请资源)
export const getResources = params => request.get('/ai/v1/resource', params)

// 获取节点资源
export const getGroupResources = params =>
  request.get('/ai/v1/group-resource', params)

// 获取节点资源模板
export const getResourceTemplate = params =>
  request.get('/ai/v1/resources-template', params)

// 添加节点资源模板
export const addResourceTemplate = params =>
  request.post('/ai/v1/resources-template', params)

// 编辑节点资源模板
export const editResourceTemplate = params =>
  request.post('/ai/v1/edit-resources-template', params)

// 删除节点资源模板
export const removeResourceTemplate = id =>
  request.delete(`/ai/v1/resources-template/${id}`)
