import axios from 'axios'

// ====================== 菜单相关 ======================
export const getMenus = params => axios.get('/menus', params)

export const addMenu = params => axios.post('/add-menu', params)

export const editMenu = params => axios.post('/edit-menu', params)

export const removeMenu = params => axios.post('/remove-menu', params)

// ====================== 用户相关 ======================
// 获取用户列表
export const getUsers = params => request.get('/users', params)

// 添加用户
export const addUser = params => request.post('/users', params)

// 编辑用户
export const editUser = params => request.post('/edit-users', params)

// 删除用户
export const removeUser = id => request.delete(`/users/${id}`)

// 获取用户信息
export const getUserInfo = () => request.get('/user-info')

// ====================== 角色相关 ======================
// 获取角色列表
export const getRoles = params => request.get('/roles', params)

// 添加角色
export const addRole = params => request.post('/roles', params)

// 编辑角色列表
export const editRole = params => {
  return request.post(`/edit-role`, params)
}

// 删除角色
export const removeRole = id => request.delete(`/roles/${id}`)

// ====================== 组织相关 ======================
// 获取组织
export const getGroups = params => request.get('/groups', params)

// 添加组织
export const addGroups = params => request.post('/groups', params)

// 更新组织
export const editGroups = params => request.post('/edit-groups', params)

// 删除组织
export const removeGroups = id => request.delete(`/remove-groups/${id}`)

// ====================== harbor相关 ======================
export const getImages = params => request.get('/harbor-images', params)

// 获取镜像详情
export const getImageTags = params => request.get('/harbor-images-tags', params)
