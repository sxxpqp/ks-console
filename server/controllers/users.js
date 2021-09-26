const { Op } = require('sequelize')

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
    { ...body },
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
