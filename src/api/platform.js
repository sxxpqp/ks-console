// import axios from 'axios'

// 获取节点资源
export const getNodes = params => request.get('/nodes', params)

export const editNodes = params => request.post('/edit-nodes', params)

// 获取应用列表
export const getAppList = params => request.post('/app-list', params)

// 获取标签列表
export const getAppTags = params => request.get('/app-labels', params)

// 获取标签列表
export const getAppTagsSumApps = params =>
  request.get('/app-labels-sum', params)

// 添加标签
export const addAppTags = params => request.post('/app-labels', params)

// 编辑标签
export const editAppTags = params => request.post('/edit-labels', params)

// 删除标签
export const removeAppTags = params => request.delete(`/app-labels/${params}`)

// 根据标签ID获取应用列表
export const getAppByTagsId = params => request.get(`/app-tags-id`, params)

// 给应用添加标签
export const updateAppTags = params => request.post('/add-app-labels', params)

// 重置应用标签
export const resetAppTags = params => request.post('/reset-app-labels', params)

// 批量设置应用标签
export const batchSetAppTags = params =>
  request.post('/batch-app-labels', params)
