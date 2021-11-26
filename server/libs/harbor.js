import axios from '../services/harbor'
// 创建用户
// /api/v2.0/users POST
export const createHarborUser = params => axios.post('/api/v2.0/users', params)

// 获取用户信息
// /api/v2.0/users?username=${username} get
export const getHarborUserInfo = username =>
  axios.get(`/api/v2.0/users?username=${username}`)

// 删除用户
// /api/v2.0/users/${user_id} DELETE
export const removeHarborUser = id => axios.delete(`/api/v2.0/users/${id}`)

// 创建用户同名项目
// /api/v2.0/projects POST
export const createHarborRepo = params =>
  axios.post('/api/v2.0/projects', {
    project_name: params,
    metadata: {
      public: 'false',
    },
    storage_limit: -1,
  })

// 获取项目的基础信息
export const getHarborRepo = params =>
  axios.get(`/api/v2.0/projects?name=${params}`)

// 添加用户到同名项目
// /api/v2.0/projects/${projectId}/members POST
// {"role_id":1,"member_user":{"username":"liwei1"}}
// role 1-管理员 2-开发者
export const addUserToRepo = (projectId, username, role = 1) =>
  axios.post(`/api/v2.0/projects/${projectId}/members`, {
    role_id: role,
    member_user: { username },
  })

// 删除项目
// /api/v2.0/projects/${project} DELETE
export const removeRepo = project =>
  axios.delete(`/api/v2.0/projects/${project}`)

// 获取用户仓库信息
// /api/v2.0/projects/${projectId}/summary GET
export const getUserRepoInfo = projectId =>
  axios.get(`/api/v2.0/projects/${projectId}/summary`)

// 获取用户镜像列表
// /api/v2.0/projects/${username}/repositories?page_size=${pageSize}&page=${current} GET
export const getUserRepos = (username, pageSize = 10, current = 1, name) => {
  let url = `/api/v2.0/projects/${username}/repositories?page_size=${pageSize}&page=${current}`
  if (name) {
    url += `&q=name%253D~${name}`
  }
  return axios.get(url)
}

// 获取公共镜像列表
export const getPublicRepo = (flag = false, pageSize = 10, current = 1) =>
  axios.get(
    `/api/v2.0/projects/library/repositories?page_size=${
      flag ? 9999999 : pageSize
    }&page=${current}`
  )

// 删除镜像
// /api/v2.0/projects/${project}/repositories/${image} DELETE
export const removeImages = (project, image) =>
  axios.delete(`/api/v2.0/projects/${project}/repositories/${image}`)
