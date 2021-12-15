import { Op } from 'sequelize'
import { omit, get } from 'lodash'
import mkdir from 'make-dir'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import path from 'path'
import {
  createUserSpace,
  createUser,
  addUserToSpace,
  createProject,
  createDevopsProject,
  createSecretConfig,
  removeK8sUser,
  removeK8sProject,
  removeDevopsProject,
} from '../libs/user'
import { cpFileToPath } from '../libs/platform'
import { getAllChildIds, generateId, getRootGroup } from '../libs/utils'
import {
  createHarborUser,
  getHarborUserInfo,
  createHarborRepo,
  addUserToRepo,
  getHarborRepo,
  getUserRepos,
  removeImages,
  removeHarborUser,
  removeRepo,
} from '../libs/harbor'

// 上传功能
export const upload = async ctx => {
  const file = ctx.request.files.file
  const { body } = ctx.request
  // const { containerID, namespace, name, node, nodeIp } = body
  const { containerID, nodeIp } = body
  const ext = path.extname(file.name)
  const tmpName = uuidv4() + ext
  const dir = `/tmp/${dayjs().format('YYYYMMDD')}`
  await mkdir(dir)
  const destPath = `${dir}/${tmpName}`
  const reader = fs.createReadStream(file.path)
  const upStream = fs.createWriteStream(destPath)
  // const filePath = `/${dayjs().format('YYYYMMDD')}/${tmpName}.${ext}`
  // method 1
  reader.pipe(upStream)
  const info = {
    containerID: containerID.substr(9, 12),
    filePath: destPath,
    node: nodeIp,
    fileName: tmpName,
    name: file.name,
    ext,
  }
  // 复制文件至容器内
  await cpFileToPath(info)
  ctx.body = {
    code: 200,
    msg: '图片上传成功',
    data: destPath,
  }
}

// 菜单列表
export const getMenus = async ctx => {
  const { menus } = global.models
  const res = await menus.findAll({})
  ctx.body = {
    code: 200,
    data: res,
  }
}

// 添加菜单
export const addMenu = async ctx => {
  const { menus } = global.models
  const { body } = ctx.request
  const res = await menus.create({ ...body })
  ctx.body = {
    code: 200,
    data: res,
  }
}

// 编辑菜单
export const editMenu = async ctx => {
  const { menus } = global.models
  const { body } = ctx.request
  const res = await menus.update(
    { ...omit(body, 'id') },
    {
      where: {
        id: body.id,
      },
    }
  )
  ctx.body = {
    code: 200,
    data: res,
  }
}

// 删除菜单
export const removeMenu = async ctx => {
  const { menus } = global.models
  const { body } = ctx.request
  const res = await menus.destroy({
    where: {
      [Op.or]: [
        {
          id: body.id,
        },
        {
          pid: body.id,
        },
      ],
    },
  })
  ctx.body = {
    code: 200,
    data: res,
  }
}

// 角色列表
export const getRoles = async ctx => {
  const { role } = global.models
  const body = ctx.query
  const { current, desc, role_name, pageSize } = body
  const conditions = {
    order: [['created', 'DESC']],
    limit: parseInt(pageSize, 10) || 10,
    offset: (parseInt(current || 1, 10) - 1) * (parseInt(pageSize, 10) || 10),
  }
  const descCondition = desc ? { desc: { [Op.like]: `%${desc}%` } } : null
  const roleNameCondition = role_name
    ? { role_name: { [Op.like]: `%${role_name}%` } }
    : null
  const where = { ...descCondition, ...roleNameCondition }
  let total = 0
  let lists = []
  await role
    .findAndCountAll({
      where,
      ...conditions,
    })
    .then(result => {
      total = result.count
      lists = result.rows
    })
  ctx.body = {
    code: 200,
    data: lists,
    total,
  }
}

// 添加角色
export const addRole = async ctx => {
  const { role } = global.models
  const { body } = ctx.request
  const res = await role.create({ ...body })
  ctx.body = {
    code: 200,
    data: res,
    total: res.length || 0,
  }
}

// 编辑角色
export const editRole = async ctx => {
  const { role } = global.models
  const { body } = ctx.request
  const res = await role.update(
    { ...omit(body, 'id') },
    {
      where: {
        id: body.id,
      },
    }
  )
  if (res && res.length > 0 && res[0] > 0) {
    ctx.body = {
      code: 200,
      data: res,
    }
  } else {
    ctx.body = {
      code: 500,
      data: res,
    }
  }
}

// 删除角色
export const removeRole = async ctx => {
  const { role } = global.models
  const body = ctx.params
  const res = await role.destroy({
    where: {
      [Op.or]: [
        {
          id: body.id,
        },
        {
          pid: body.id,
        },
      ],
    },
  })
  ctx.body = {
    code: 200,
    data: res,
  }
}

// 获取平台用户
export const getUsers = async ctx => {
  const { id, pageSize, current, gid, status, username, name } = ctx.query
  const { users, users_group, groups, role, users_role } = global.models
  const conditions = {
    order: [['created', 'DESC']],
    limit: parseInt(pageSize, 10) || 10,
    offset: (parseInt(current || 1, 10) - 1) * (parseInt(pageSize, 10) || 10),
  }
  let where = {}
  if (id) {
    const idCond = { id: { [Op.eq]: id } }
    where = { ...where, ...idCond }
  }
  if (username) {
    const usernameCond = { username: { [Op.like]: `%${username}%` } }
    where = { ...where, ...usernameCond }
  }
  if (name) {
    const nameCond = { name: { [Op.like]: `%${name}%` } }
    where = { ...where, ...nameCond }
  }
  if (status || status === '0') {
    const statusCond = { status: { [Op.eq]: parseInt(status, 10) } }
    where = { ...where, ...statusCond }
  }
  let gidWhere = {}
  if (gid) {
    const groupsData = await groups.findAll({
      raw: true,
    })
    const gidArr = getAllChildIds(groupsData, parseInt(gid, 10))
    gidArr.push(gid)
    gidWhere = {
      where: {
        gid: {
          [Op.in]: gidArr,
        },
      },
    }
  }
  const res = await users.findAndCountAll({
    attributes: Object.keys(omit(users.rawAttributes, ['password'])),
    where,
    ...conditions,
    include: [
      {
        model: users_group,
        ...gidWhere,
        include: [
          {
            model: groups,
          },
        ],
      },
      {
        model: users_role,
        include: [
          {
            model: role,
          },
        ],
      },
    ],
    // raw: true,
  })
  if (res && res.rows) {
    ctx.body = {
      code: 200,
      data: res.rows,
      total: res.count,
    }
  } else {
    ctx.body = {
      code: 500,
      msg: '获取用户消息失败',
    }
  }
}

// 获取用户信息 - 与上面的方法有一定的重复，这个是获取当前用户
export const getUserInfo = async ctx => {
  const { users, users_group, users_role, groups, role } = global.models
  if (ctx.user) {
    const res = await users.findAll({
      attributes: Object.keys(omit(users.rawAttributes, 'password')),
      where: {
        id: parseInt(ctx.user.id, 10),
      },
      include: [
        {
          model: users_group,
          include: [
            {
              model: groups,
            },
          ],
        },
        {
          model: users_role,
          include: [
            {
              model: role,
            },
          ],
        },
      ],
    })
    ctx.body = {
      code: 200,
      data: res,
    }
  } else {
    ctx.body = {
      code: 500,
      msg: '用户不存在或者参数非法',
    }
  }
}

// 添加用户
export const addUsers = async ctx => {
  const { body } = ctx.request
  const { users, groups, users_role, users_group } = global.models
  const user = await users.findAll({
    where: {
      username: body.username,
    },
  })
  if (user && user.length > 0) {
    ctx.body = {
      code: 500,
      msg: '用户名重复',
    }
    return
  }
  const gname = generateId()
  // 创建k8s用户
  await createUser({
    name: body.username,
    email: body.email || `${gname}@netin.com`,
    password: body.password,
  })
  // 根据级别添加到对应的企业空间
  const groupData = await groups.findAll({
    raw: true,
  })
  const userGroup = groupData.find(item => item.id === body.pid)
  // 获取根级group
  const rootGroup = getRootGroup(groupData, body.pid)
  const workspace = rootGroup.code
  const { username } = body
  body.cluster = 'default'
  body.workspace = workspace
  await addUserToSpace(workspace, username)
  // 创建项目 -> 创建同名project项目
  await createProject(workspace, username, username)
  body.namespace = username
  // todo 设置项目的限额
  // 创建harbor用户 -> 添加harbor密钥
  const gPass = generateId(8, true)
  body.harborPass = gPass
  await createHarborUser({
    username,
    email: body.email || `${gname}@netin.com`,
    realname: body.name || gname,
    password: gPass,
  })
  const harborUser = await getHarborUserInfo(username)
  if (
    harborUser.status === 200 &&
    harborUser.data &&
    harborUser.data.length > 0
  ) {
    const userId = harborUser.data[0].user_id
    body.harborId = userId
  }
  await createHarborRepo(username)
  const repo = await getHarborRepo(username)
  if (repo.status === 200 && repo.data && repo.data.length > 0) {
    const data = repo.data[0]
    const projectId = data.project_id
    // 添加用户到对应的Project下
    await addUserToRepo(projectId, username)
    // todo 获取harbor配置，添加到library公共项目中，分配拉取推送权限，无法删除
    const { harbor } = global.server
    await addUserToRepo(harbor.pid, username, 2)
    // 添加用户到公共的Project下
    body.harborPid = projectId
  }
  // 添加私有仓库密钥
  await createSecretConfig(username, gPass)
  const devops = generateId()
  // body.devops = devops
  // 创建用户名同名devops工程
  const devOpsRes = await createDevopsProject(workspace, devops)
  if (devOpsRes) {
    body.devops = get(devOpsRes, 'metadata.name')
  }
  const res = await users.create({
    ...body,
    created: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  })
  // 判断是否是空间管理员 -> 如果是添加在pid一级 为管理员 ->  users_group -> isAdmin

  const userGroupObj = {
    uid: res.id,
    gid: body.pid,
    isAdmin: userGroup.pid === -1 ? 1 : 0,
    cluster: 'default',
    workspace,
    namespace: username,
    devops,
    cpu: 0,
    mem: 0,
    disk: 0,
    gpu: 0,
  }
  users_group.create(userGroupObj)
  const arr = body.role.map(i => ({
    uid: res.id,
    roleId: i,
  }))
  await users_role.bulkCreate(arr)
  ctx.body = {
    code: 200,
    data: res,
  }
}

// 编辑用户
export const editUser = async ctx => {
  const { users } = global.models
  const { body } = ctx.request
  const { id } = body
  if (id) {
    if (!body.password.trim()) {
      delete body.password
    }
    const res = await users.update(
      { ...omit(body, 'id') },
      {
        where: {
          id,
        },
      }
    )
    ctx.body = {
      code: 200,
      // data: res,
      msg: res && res.length && res[0] > 0 ? '更新成功' : '更新失败',
      data: res,
    }
  } else {
    ctx.body = {
      code: 500,
      msg: '参数非法',
    }
  }
}

// 删除用户
export const removeUser = async ctx => {
  const { users, users_app, users_role, users_group, resources } = global.models
  const { id } = ctx.params
  const user = await users.findAll({
    where: {
      id: parseInt(id, 10),
    },
    raw: true,
  })
  if (user && user.length > 0) {
    const temp = user[0]
    const { username, workspace, namespace, devops, harborId, harborPid } = temp
    // 删除用户的resources申请
    await resources.destroy({
      where: {
        uid: id,
      },
    })
    // 删除k8s用户
    await removeK8sUser(username)
    // 删除企业空间中的项目
    await removeK8sProject(workspace, namespace)
    // 删除devops工程
    await removeDevopsProject(workspace, devops)
    // 获取用户的镜像列表
    const images = await getUserRepos(username, 999999)
    if (images.status === 200 && images.data && images.data.length > 0) {
      const tmps = images.data
      // 删除镜像
      for (let i = 0; i < tmps.length; i++) {
        await removeImages(
          username,
          tmps[i].name.replace(new RegExp(`${username}/`), '')
        )
      }
    }
    // 删除harbor用户
    await removeHarborUser(harborId)
    // 删除harbor项目
    await removeRepo(harborPid)
    const res = await users.destroy({
      where: {
        id: parseInt(id, 10),
      },
    })
    // 删除的应用
    await users_app.destroy({
      where: {
        username,
      },
    })
    await users_role.destroy({
      where: {
        uid: parseInt(id, 10),
      },
    })
    await users_group.destroy({
      where: {
        uid: parseInt(id, 10),
      },
    })
    ctx.body = {
      code: 200,
      data: res,
    }
  } else {
    ctx.body = {
      code: 500,
      msg: '用户不存在或已经删除',
    }
  }
}

// 获取组织信息
export const getGroups = async ctx => {
  const { groups } = global.models
  const body = ctx.query
  const { name } = body
  // const { current, name, pageSize } = body
  const conditions = {
    order: [
      ['created', 'ASC'],
      ['sort', 'ASC'],
    ],
    // limit: parseInt(pageSize, 10) || 10,
    // offset: (parseInt(current || 1, 10) - 1) * (parseInt(pageSize, 10) || 10),
  }
  const nameCond = name ? { name: { [Op.like]: `%${name}%` } } : null
  const where = { ...nameCond }
  let total = 0
  let lists = []
  await groups
    .findAndCountAll({
      where,
      ...conditions,
    })
    .then(result => {
      total = result.count
      lists = result.rows
    })
  ctx.body = {
    code: 200,
    data: lists,
    total,
  }
}

// 添加组织信息
export const addGroups = async ctx => {
  const { groups } = global.models
  const { body } = ctx.request
  const res = await groups.create({ ...body })
  // 创建企业空间
  if (body.type === 0) {
    await createUserSpace({
      user: 'admin',
      workspace: body.code,
    })
  }
  ctx.body = {
    code: 200,
    data: res,
  }
}

// 编辑组织信息
export const editGroups = async ctx => {
  const { groups } = global.models
  const { body } = ctx.request
  if (body.id) {
    const res = await groups.update(
      { ...omit(body, 'id') },
      {
        where: {
          id: body.id,
        },
      }
    )
    ctx.body = {
      code: 200,
      // data: res,
      msg: res && res.length && res[0] > 0 ? '更新成功' : '更新失败',
      data: res,
    }
  } else {
    ctx.body = {
      code: 500,
      msg: '更新失败',
    }
  }
}

// 删除组织信息
export const removeGroups = async ctx => {
  const { groups } = global.models
  const { id } = ctx.params

  const idCond = id
    ? {
        [Op.or]: [{ id }, { pid: id }],
      }
    : null
  const res = await groups.destroy({
    where: idCond,
  })
  if (res && res > 0) {
    ctx.body = {
      code: 200,
      data: res,
    }
  } else {
    ctx.body = {
      code: 500,
      msg: '删除失败',
    }
  }
}
