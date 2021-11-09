import { cpFileToPath } from '../libs/platform'

const { Op } = require('sequelize')

const { omit } = require('lodash')
const mkdir = require('make-dir')
const dayjs = require('dayjs')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
const path = require('path')

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
  const { users } = global.models
  const res = await users.findAll({})
  ctx.body = {
    code: 200,
    data: res,
  }
}

// 添加用户
export const addUsers = async ctx => {
  const { users } = global.models
  const { body } = ctx.request
  const res = await users.create({ ...body })
  ctx.body = {
    code: 200,
    data: res,
  }
}

// 编辑用户
export const editUsers = async ctx => {
  const { users } = global.models
  const { body } = ctx.request
  const { id } = ctx.params
  if (id) {
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
      msg: '更新失败',
    }
  }
}

// 删除用户
export const removeUsers = async ctx => {
  const { users } = global.models
  const { body } = ctx.request
  const res = await users.destroy({
    where: {
      [Op.or]: [
        body.id
          ? {
              id: body.id,
            }
          : {},
        body.email
          ? {
              email: body?.email,
            }
          : null,
      ],
    },
  })
  ctx.body = {
    code: 200,
    data: res,
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
