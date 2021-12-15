// import axios from 'axios'

// ====================== 菜单相关 ======================
export const getMenus = params => request.get('/ai/v1/menus', params)

export const addMenu = params => request.post('/ai/v1/add-menu', params)

export const editMenu = params => request.post('/ai/v1/edit-menu', params)

export const removeMenu = params => request.post('/ai/v1/remove-menu', params)
export const batchRemoveMenu = params =>
  request.post('/ai/v1/batch-remove-menu', params)

// ====================== 用户相关 ======================
// 获取用户列表
export const getUsers = params => request.get('/ai/v1/users', params)

// 添加用户
export const addUser = params => request.post('/ai/v1/users', params)

// 编辑用户
export const editUser = params => request.post('/ai/v1/edit-users', params)

// 删除用户
export const removeUser = id => request.delete(`/ai/v1/users/${id}`)

// 获取用户信息
export const getUserInfo = () => request.get('/ai/v1/user-info')

// ====================== 角色相关 ======================
// 获取角色列表
export const getRoles = params => request.get('/ai/v1/roles', params)

// 添加角色
export const addRole = params => request.post('/ai/v1/roles', params)

// 编辑角色列表
export const editRole = params => {
  return request.post(`/ai/v1/edit-role`, params)
}

// 删除角色
export const removeRole = id => request.delete(`/ai/v1/roles/${id}`)

// ====================== 组织相关 ======================
// 获取组织
export const getGroups = params => request.get('/ai/v1/groups', params)

// 添加组织
export const addGroups = params => request.post('/ai/v1/groups', params)

// 更新组织
export const editGroups = params => request.post('/ai/v1/edit-groups', params)

// 删除组织
export const removeGroups = id => request.delete(`/ai/v1/remove-groups/${id}`)

// ====================== harbor相关 ======================
export const getImages = params => request.get('/ai/v1/harbor-images', params)

// 获取镜像详情
export const getImageTags = params =>
  request.get('/ai/v1/harbor-images-tags', params)
