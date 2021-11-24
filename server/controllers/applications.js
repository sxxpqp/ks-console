import { omit } from 'lodash'
import { Op, fn, col } from 'sequelize'
import { getK8sAppList } from '../services/platform'
import request from '../libs/axios'

// 获取应用列表
export const getAppList = async ctx => {
  const { current, pageSize, name, tagId, status, type } = ctx.request.body
  const { users_app, app_labels, labels } = global.models
  const conditions = {
    order: [['created', 'DESC']],
    limit: parseInt(pageSize, 10) || 10,
    offset: (parseInt(current || 1, 10) - 1) * (parseInt(pageSize, 10) || 10),
  }
  let where = {}
  if (name) {
    where = {
      ...where,
      name: {
        [Op.like]: `%${name}%`,
      },
    }
  }
  if (status || status === 0) {
    where = {
      ...where,
      status: {
        [Op.eq]: parseInt(status, 10),
      },
    }
  }
  if (type || type === 0) {
    where = {
      ...where,
      type: {
        [Op.eq]: parseInt(type, 10),
      },
    }
  }
  const include =
    tagId && tagId.length > 0
      ? [
          {
            model: app_labels,
            where: {
              tagId: {
                [Op.in]: tagId,
              },
            },
            include: [
              {
                model: labels,
              },
            ],
          },
        ]
      : [
          {
            model: app_labels,
            include: [
              {
                model: labels,
              },
            ],
          },
        ]
  const res = await users_app.findAndCountAll({
    attributes: Object.keys(omit(users_app.rawAttributes, ['meta'])),
    where,
    include,
    ...conditions,
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
      msg: '请求应用列表失败',
    }
  }
}

// 创建应用之后，更新应用列表
export const updateAppList = async ctx => {
  const { body } = ctx.request
  const { workspace, namespace } = body
  const res = await getK8sAppList({
    workspace,
    namespace,
  })
  ctx.body = {
    code: 200,
    data: res,
  }
}

// 删除应用
export const removeApp = async ctx => {
  const { id } = ctx.params
  const { users_app } = global.models
  const app = await users_app.findAll({
    where: {
      appId: id,
    },
  })
  let result
  if (app && app.length > 0) {
    const item = app[0]
    if (item.type === 0) {
      const url = `/kapis/openpitrix.io/v1/workspaces/${item.workspace}/namespaces/${item.namespace}/applications/${id}`
      result = await request.delete(url)
    } else {
      const url = `/apis/app.k8s.io/v1beta1/namespaces/${item.namespace}/applications/${id}`
      result = await request.delete(url)
    }
  }
  const res = await users_app.destroy({
    where: {
      appId: id,
    },
  })
  ctx.body = {
    code: 200,
    data: res,
    msg: result,
  }
}

// 获取应用标签
export const getAppTags = async ctx => {
  const { labels } = global.models
  let total = 0
  let lists = []
  await labels.findAndCountAll({}).then(result => {
    total = result.count
    lists = result.rows
  })
  ctx.body = {
    code: 200,
    data: lists,
    total,
  }
}

// SELECT a.id, a.name, COUNT(b.appId) FROM labels a LEFT JOIN app_labels b ON a.id = b.tagId group by a.id
export const getAppTagsCountApp = async ctx => {
  const { labels, app_labels, users_app } = global.models
  const appIds = await app_labels.findAll({
    attributes: ['appId'],
    raw: true,
  })
  const notTags = await users_app.findAll({
    attributes: [[fn('COUNT', col('appId')), 'count']],
    where: {
      appId: {
        [Op.notIn]: appIds.map(i => i.appId),
      },
    },
    raw: true,
  })
  const res = await labels.findAll({
    attributes: [
      ...Object.keys(labels.rawAttributes),
      [fn('COUNT', col('app_labels.appId')), 'count'],
    ],
    include: [
      {
        model: app_labels,
        attributes: [],
      },
    ],
    group: ['labels.id'],
    raw: true,
  })
  if (notTags && notTags.length) {
    res.push({
      id: -1,
      name: '未分类',
      icon: 'tag',
      count: notTags[0].count,
    })
  }
  ctx.body = {
    code: 200,
    data: res,
  }
}

// 添加应用标签
export const addAppTags = async ctx => {
  const { labels } = global.models
  const { body } = ctx.request
  const res = await labels.create({ ...body })
  ctx.body = {
    code: 200,
    data: res,
  }
}

// 编辑应用标签
export const editAppTags = async ctx => {
  const { labels } = global.models
  const { body } = ctx.request
  if (body.id) {
    const res = await labels.update(
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

// 删除应用标签
export const removeAppTags = async ctx => {
  const { labels, app_labels } = global.models
  const { id } = ctx.params

  const res = await labels.destroy({
    where: {
      id: parseInt(id, 10),
    },
  })
  // 删除应用标签
  await app_labels.destroy({
    where: {
      tagId: parseInt(id, 10),
    },
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

// 获取应用的tags标签
export const getAppTagsById = async ctx => {
  const { id } = ctx.query
  const { app_labels, labels } = global.models
  const res = await labels.findAndCountAll({
    distinct: true,
    include: [
      {
        model: app_labels,
        where: {
          appId: id,
        },
        // include: [
        //   {
        //     model: users_app,
        //     attributes: Object.keys(omit(users_app.rawAttributes, ['meta'])),
        //   },
        // ],
      },
    ],
  })
  if (res && res.rows) {
    ctx.body = {
      code: 200,
      data: res.rows,
      count: res.count,
    }
  }
}

// 通过标签名称 获取应用
export const getAppByTagsName = async ctx => {
  const { name } = ctx.query
  const { app_labels, labels, users_app } = global.models
  const res = await labels.findAndCountAll({
    distinct: true,
    where: {
      name: {
        [Op.like]: `%${name}%`,
      },
    },
    include: [
      {
        model: app_labels,
        include: [
          {
            model: users_app,
            attributes: Object.keys(omit(users_app.rawAttributes, ['meta'])),
          },
        ],
      },
    ],
  })
  if (res && res.rows) {
    ctx.body = {
      code: 200,
      data: res.rows,
      count: res.count,
    }
  }
}

// 通过标签ID 获取应用
export const getAppByTagsId = async ctx => {
  const { id, pageSize, current } = ctx.query
  const { app_labels, users_app } = global.models
  const conditions = {
    order: [['created', 'DESC']],
    limit: parseInt(pageSize, 10) || 10,
    offset: (parseInt(current || 1, 10) - 1) * (parseInt(pageSize, 10) || 10),
  }
  let where = {}
  let include = [
    {
      model: app_labels,
    },
  ]
  if (id === '-1' || !id) {
    // 查询未分类应用
    const appIds = await app_labels.findAll({
      attributes: ['appId'],
      distinct: true,
      raw: true,
    })
    if (appIds && appIds.length) {
      where = {
        ...where,
        appId: {
          [Op.notIn]: Array.from(new Set(appIds.map(i => i.appId))),
        },
      }
    }
  } else {
    include = [
      {
        model: app_labels,
        where: {
          tagId: {
            [Op.eq]: parseInt(id, 10),
          },
        },
      },
    ]
  }
  const res = await users_app.findAndCountAll({
    distinct: true,
    ...conditions,
    where,
    attributes: Object.keys(omit(users_app.rawAttributes, ['meta'])),
    include,
  })
  if (res && res.rows) {
    ctx.body = {
      code: 200,
      data: res.rows,
      total: res.count,
    }
  }
}

// 更新应用标签
export const updateAppTags = async ctx => {
  const { appId, tagId } = ctx.request.body
  const arr = tagId.map(i => ({
    appId,
    tagId: i,
  }))
  const { app_labels } = global.models
  const res = await app_labels.bulkCreate(arr, {
    updateOnDuplicate: Object.keys(app_labels.rawAttributes),
  })
  ctx.body = {
    code: 200,
    data: res,
  }
}

// 重置应用标签
export const resetAppTags = async ctx => {
  const { appIds, tagId } = ctx.request.body
  const { app_labels } = global.models
  const res = await app_labels.destroy({
    where: {
      appId: {
        [Op.in]: appIds,
      },
      tagId: {
        [Op.eq]: tagId,
      },
    },
  })
  if (res && res > 0) {
    ctx.body = {
      code: 200,
      data: res,
    }
  } else {
    ctx.body = {
      code: 500,
      msg: '无可删除项，删除失败',
    }
  }
}

// 批量设置应用标签
export const batchSetAppTags = async ctx => {
  // 新设置所有应用的标签
  const { appIds, tagIds } = ctx.request.body
  const { app_labels } = global.models
  // 重置所有的标签
  // await app_labels.destroy({
  //   where: {
  //     appId: {
  //       [Op.in]: appIds,
  //     },
  //   },
  // })
  const arr = []
  appIds.forEach(i => {
    tagIds.forEach(t => {
      arr.push({
        appId: i,
        tagId: t,
      })
    })
  })
  const res = await app_labels.bulkCreate(arr, {
    updateOnDuplicate: Object.keys(app_labels.rawAttributes),
  })
  ctx.body = {
    code: 200,
    data: res,
  }
}
