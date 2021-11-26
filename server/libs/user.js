// import { get } from 'lodash'
import { omit } from 'lodash'
import request from './axios'
import {
  getUserTemplate,
  getSpaceTemplate,
  getSpaceRoleTemplate,
  getSpaceRoleUpdateTemplate,
  getProjectRoleTemplate,
  getProjectTemplate,
  getDevopsTemplate,
  getSecretTemplate,
} from './templates'

// 创建用户
// url: /kapis/iam.kubesphere.io/v1alpha2/users
export const createUser = async data => {
  const template = getUserTemplate(data)
  const result = await request.post(
    '/kapis/iam.kubesphere.io/v1alpha2/users',
    template
  )
  // todo 创建用户数据库写入逻辑
  return result
}

// 创建用户企业空间
export const createUserSpace = async data => {
  const template = getSpaceTemplate(data)
  const result = await request.post(
    '/kapis/tenant.kubesphere.io/v1alpha2/workspaces',
    template
  )
  // todo 创建企业空间存入数据库
  return result
}

// 删除企业空间
export const removeUserSpace = async workspace => {
  const url = `/kapis/tenant.kubesphere.io/v1alpha2/workspaces/${workspace}`
  const result = await request.delete(url)
  return result
}

// 获取用户的企业空间的配额
export const getUserSpaceQuota = async workspace => {
  const result = await request.get(
    `/kapis/tenant.kubesphere.io/v1alpha2/workspaces/${workspace}/resourcequotas/${workspace}`
  )
  return result
}
// 设置用户的企业空间的资源
export const updateUserSpaceQuota = async (
  workspace,
  data,
  cluster = 'default'
) => {
  const { template: quotaTemplate } = data

  const template = {
    apiVersion: 'quota.kubesphere.io/v1alpha2',
    kind: 'ResourceQuota',
    metadata: {
      name: workspace,
      workspace,
      cluster,
      resourceVersion: data.resourceVersion,
    },
    spec: {
      quota: {
        hard: data.hard,
      },
    },
    ...quotaTemplate,
  }
  const result = await request.put(
    `/kapis/tenant.kubesphere.io/v1alpha2/workspaces/${workspace}/resourcequotas/${workspace}`,
    template
  )
  return result
}

// 企业空间角色重名检查
// /kapis/iam.kubesphere.io/v1alpha2/workspaces/test4-namespace/workspaceroles/name1
export const checkSpaceRoleName = async (workspace, name) => {
  try {
    const result = await request.get(
      `/kapis/iam.kubesphere.io/v1alpha2/workspaces/${workspace}/workspaceroles/${name}`
    )
    return !!result
  } catch (error) {
    // console.log(
    //   '🚀 ~ file: user.js ~ line 79 ~ checkSpaceRoleName ~ error',
    //   error.response.status
    // )
    return false
  }
}

// 获取企业空间角色列表
export const getSpaceRoleList = async workspace => {
  const result = await request.get(
    `/kapis/iam.kubesphere.io/v1alpha2/workspaces/${workspace}/workspaceroles?sortBy=createTime&annotation=kubesphere.io%2Fcreator`
  )
  return result
}

// 获取企业空间角色Template列表
export const getSpaceRoleTemplateList = async workspace => {
  const result = await request.get(
    `/kapis/iam.kubesphere.io/v1alpha2/workspaces/${workspace}/workspaceroles?label=iam.kubesphere.io/role-template=true`
  )
  return result
}

// 创建企业空间角色
export const createSpaceRole = async data => {
  const { workspace, name, rights } = data
  const template = getSpaceRoleTemplate({ name, rights })
  const result = await request.post(
    `/kapis/iam.kubesphere.io/v1alpha2/workspaces/${workspace}/workspaceroles`,
    template
  )
  return result
}

// 获取角色信息
export const getSpaceRole = async (workspace, name) => {
  const result = await request.get(
    `/kapis/iam.kubesphere.io/v1alpha2/workspaces/${workspace}/workspaceroles/${name}`
  )
  return result
}

// 更新企业角色信息
export const updateSpaceRole = async data => {
  const { workspace, name } = data
  const template = getSpaceRoleUpdateTemplate(data)
  const result = await request.put(
    `/kapis/iam.kubesphere.io/v1alpha2/workspaces/${workspace}/workspaceroles/${name}`,
    template
  )
  return result
}

// 添加用户到企业空间
export const addUserToSpace = async (workspace, username) => {
  // url: /kapis/iam.kubesphere.io/v1alpha2/workspaces/test4-namespace/workspacemembers
  // [{"username":"demo","roleRef":"test4-namespace-regular"}]
  const result = await request.post(
    `/kapis/iam.kubesphere.io/v1alpha2/workspaces/${workspace}/workspacemembers`,
    [{ username, roleRef: `${workspace}-regular` }]
  )
  return result
}

// 查看项目名称是否存在
export const checktProjectName = async name => {
  try {
    const result = await request.get(`/api/v1/namespaces/${name}`)
    return !!result
  } catch (error) {
    // console.log(
    //   '🚀 ~ file: user.js ~ line 79 ~ checkSpaceRoleName ~ error',
    //   error.response.status
    // )
    return false
  }
}

// 创建项目
export const createProject = async (workspace, project, user = 'admin') => {
  const template = getProjectTemplate({ workspace, project, user })
  const result = await request.post(
    `/kapis/tenant.kubesphere.io/v1alpha2/workspaces/${workspace}/namespaces`,
    template
  )
  return result
}

// 删除项目
export const removeK8sProject = async (workspace, project) => {
  const url = `/kapis/tenant.kubesphere.io/v1alpha2/workspaces/${workspace}/namespaces/${project}`
  const result = await request.delete(url)
  return result
}

// 添加用户到项目
// 只能设置企业空间下面的用户
export const addUserToProject = async (
  project,
  users,
  roleRef = 'operator'
) => {
  const result = await request.post(
    `/kapis/iam.kubesphere.io/v1alpha2/namespaces/${project}/members`,
    // 设置用户的项目权限
    users.map(user => ({ username: user, roleRef }))
  )
  return result
}

// 查看项目角色名是否存在
export const checkProjectRoleName = async (project, name) => {
  try {
    const result = await request.get(
      `/kapis/iam.kubesphere.io/v1alpha2/namespaces/${project}/roles/${name}`
    )
    return !!result
  } catch (error) {
    return false
  }
}

// 添加项目角色与权限
export const createProjectRole = async data => {
  const { project } = data
  const template = getProjectRoleTemplate(data)
  const result = await request.post(
    `/kapis/iam.kubesphere.io/v1alpha2/namespaces/${project}/roles`,
    omit(template, 'metadata.resourceVersion')
  )
  return result
}

// 获取项目角色与权限列表
export const getProjectRoleList = async project => {
  const result = await request.get(
    `/kapis/iam.kubesphere.io/v1alpha2/namespaces/${project}/roles?sortBy=createTime&annotation=kubesphere.io%2Fcreator`
  )
  return result
}

export const getProjectRoleTemplates = async project => {
  const result = await request.get(
    `/kapis/iam.kubesphere.io/v1alpha2/namespaces/${project}/roles?label=iam.kubesphere.io/role-template=true`
  )
  return result
}

// 更新项目角色与权限
export const updateProjectRole = async data => {
  const { project, name } = data
  const result = await request.put(
    `/kapis/iam.kubesphere.io/v1alpha2/namespaces/${project}/roles/${name}`,
    getProjectRoleTemplate(data)
  )
  return result
}

// 删除项目角色与权限
export const deletProjectRole = async (project, name) => {
  const result = await request.delete(
    `/kapis/iam.kubesphere.io/v1alpha2/namespaces/${project}/roles/${name}`
  )
  return result
}

// 获取项目配额信息
export const getProjectQuota = async project => {
  const result = await request.get(
    `/kapis/resources.kubesphere.io/v1alpha2/namespaces/${project}/quotas`
  )
  return result
}

// 设置用户的项目资源
export const updateProjectQuota = async data => {
  const { project, hard, cluster = 'default' } = data
  const template = {
    apiVersion: 'v1',
    kind: 'ResourceQuota',
    metadata: {
      name: project,
      namespace: project,
      cluster,
      annotations: {
        'kubesphere.io/creator': 'admin',
      },
    },
    spec: {
      hard,
      // hard: {
      //   'limits.cpu': '6.8',
      //   'limits.memory': '13.9Gi',
      //   'requests.cpu': '0.99',
      //   'requests.memory': '2.1Gi',
      //   'count/pods': 10,
      //   'count/deployments.apps': 1,
      //   'count/statefulsets.apps': 2,
      //   'count/daemonsets.apps': 3,
      //   'count/jobs.batch': 4,
      //   'count/cronjobs.batch': 5,
      //   persistentvolumeclaims: 6,
      //   'count/services': 7,
      //   'count/ingresses.extensions': 87,
      //   'count/secrets': 8,
      //   'count/configmaps': 12,
      // },
    },
  }
  const result = await request.post(
    `/api/v1/namespaces/${project}/resourcequotas`,
    template
  )
  return result
}

// 获取容器资源限制
export const getContainerResourceLimit = async (workspace, project) => {
  const result = await request.get(
    `/api/v1/namespaces/${project}/limitranges?workspace=${workspace}`
  )
  return result
}
// 限制容器资源
export const updateContainerResourceLimit = async data => {
  const { project, limits } = data
  const template = {
    apiVersion: 'v1',
    kind: 'LimitRange',
    metadata: {
      annotations: {
        'kubesphere.io/creator': 'admin',
      },
    },
    spec: {
      limits,
    },
  }
  // {
  //       default: {
  //         cpu: '3.8',
  //         memory: '2100Mi',
  //       },
  //       defaultRequest: {
  //         cpu: '0.26',
  //         memory: '410Mi',
  //       },
  //       type: 'Container',
  //     },
  const result = await request.post(
    `/api/v1/namespaces/${project}/limitranges`,
    template
  )
  return result
}

// 删除项目用户
export const removeProjectUser = async (project, user) => {
  const result = await request.delete(
    `/kapis/iam.kubesphere.io/v1alpha2/namespaces/${project}/members/${user}`
  )
  return result
}

// 删除k8s用户
export const removeK8sUser = async username => {
  // /kapis/iam.kubesphere.io/v1alpha2/users/
  const result = await request.delete(
    `/kapis/iam.kubesphere.io/v1alpha2/users/${username}`
  )
  return result
}

// 修改用户密码
export const updateUserPassword = async (username, password) => {
  // /kapis/iam.kubesphere.io/v1alpha2/users/test2/password
  const result = await request.PUT(
    `/kapis/iam.kubesphere.io/v1alpha2/users/${username}/password`,
    {
      password,
      rePassword: password,
    }
  )
  return result
}

// 创建devops工程
export const createDevopsProject = async (workspace, devops) => {
  // /kapis/devops.kubesphere.io/v1alpha3/workspaces/bqcmza/devops
  const params = getDevopsTemplate(workspace, devops)
  const result = await request.post(
    `/kapis/devops.kubesphere.io/v1alpha3/workspaces/${workspace}/devops`,
    params
  )
  return result
}

// 删除devOps工程
export const removeDevopsProject = async (workspace, devops) => {
  const url = `/kapis/devops.kubesphere.io/v1alpha3/workspaces/${workspace}/devops/${devops}`
  const result = await request.delete(url)
  return result
}

// 创建密钥
export const createSecretConfig = async (username, password, flag = false) => {
  const { harbor } = global.server
  // /api/v1/namespaces/liwei1/secrets
  const params = getSecretTemplate({
    username,
    harborPass: password,
    harborUrl: harbor.private,
    flag,
  })
  const result = await request.post(
    `/api/v1/namespaces/${username}/secrets`,
    params
  )
  return result
}
