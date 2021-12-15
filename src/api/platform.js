// import axios from 'axios'

// 获取节点资源
export const getNodes = params => request.get('/ai/v1/nodes', params)

export const editNodes = params => request.post('/ai/v1/edit-nodes', params)

// 获取应用列表
export const getAppList = params => request.post('/ai/v1/app-list', params)

// 更新应用
export const updateApp = params => request.post('/ai/v1/update-app', params)

// 更新应用列表
export const updateAppList = params =>
  request.post('/ai/v1/update-app-list', params)

// 删除应用
export const removeApp = id => request.delete(`/ai/v1/remove-app/${id}`)

// 获取标签列表
export const getAppTags = params => request.get('/ai/v1/app-labels', params)

// 获取标签列表
export const getAppTagsSumApps = params =>
  request.get('/ai/v1/app-labels-sum', params)

// 添加标签
export const addAppTags = params => request.post('/ai/v1/app-labels', params)

// 编辑标签
export const editAppTags = params => request.post('/ai/v1/edit-labels', params)

// 删除标签
export const removeAppTags = params =>
  request.delete(`/ai/v1/app-labels/${params}`)

// 根据标签ID获取应用列表
export const getAppByTagsId = params =>
  request.get(`/ai/v1/app-tags-id`, params)

// 给应用添加标签
export const updateAppTags = params =>
  request.post('/ai/v1/add-app-labels', params)

// 重置应用标签
export const resetAppTags = params =>
  request.post('/ai/v1/reset-app-labels', params)

// 批量设置应用标签
export const batchSetAppTags = params =>
  request.post('/ai/v1/batch-app-labels', params)
