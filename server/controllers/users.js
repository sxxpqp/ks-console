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
  const res = await role.findAll({})
  ctx.body = {
    code: 200,
    data: res,
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
  ctx.body = {
    code: 200,
    data: res,
  }
}

// 删除角色
export const removeRole = async ctx => {
  const { role } = global.models
  const { body } = ctx.request
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
