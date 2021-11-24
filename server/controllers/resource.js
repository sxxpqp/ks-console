import { omit } from 'lodash'
import { Op, fn, col } from 'sequelize'
import { getAllPids, getAllChildIds } from '../libs/utils'

// 申请资源
export const applyRes = async ctx => {
  const { body } = ctx.request
  const { resources } = global.models
  // const res = await models.resources.findAll()
  // console.log('🚀 ~ file: platform.js ~ line 6 ~ res', res)
  const { cpu, mem, gpu, disk, reason, type, app } = body
  const res = await resources.create({
    uid: ctx.user.id,
    cpu: parseInt(cpu, 10),
    mem: parseInt(mem, 10),
    gpu: parseInt(gpu, 10),
    disk: parseInt(disk, 10),
    type,
    reason,
    app,
  })
  ctx.body = {
    code: 200,
    data: res,
  }
}

const handleApply = async (ctx, uid) => {
  const {
    id,
    status,
    reason,
    pageSize,
    current,
    nolimit = 0,
    name,
    gid,
  } = ctx.query
  const { resources, users, users_group, groups } = global.models
  const conditions = !nolimit
    ? {
        order: [['created', 'DESC']],
        limit: parseInt(pageSize, 10) || 10,
        offset:
          (parseInt(current || 1, 10) - 1) * (parseInt(pageSize, 10) || 10),
      }
    : null
  let where = {}
  let userWhere = {}
  let groupWhere = {}
  const statusCond =
    parseInt(status, 10) !== -1
      ? { status: { [Op.eq]: parseInt(status, 10) } }
      : { status: { [Op.ne]: -1 } }
  where = { ...where, ...statusCond }
  if (reason) {
    const reasonCond = { reason: { [Op.like]: `%${reason}%` } }
    where = { ...where, ...reasonCond }
  }
  if (id || uid) {
    const idCond = { uid: { [Op.eq]: parseInt(id || uid, 10) } }
    where = { ...where, ...idCond }
  }
  if (name) {
    const nameCond = { name: { [Op.like]: `%${name}%` } }
    userWhere = { ...userWhere, ...nameCond }
  }
  if (gid) {
    const groupData = await groups.findAll({ raw: true })
    const ids = [parseInt(gid, 10)]
    ids.push(...getAllChildIds(groupData, parseInt(gid, 10)))
    const gidCond = { gid: ids }
    groupWhere = { ...gidCond }
  }
  const res = await resources.findAndCountAll({
    where,
    ...conditions,
    include: [
      {
        model: users,
        where: userWhere,
        include: [
          {
            model: users_group,
            where: groupWhere,
          },
        ],
      },
    ],
    distinct: true,
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
      msg: '查询资源失败',
    }
  }
}

// 获取申请资源列表 - 获取当前用户 - 分页数据
export const getApply = async ctx => {
  const uid = ctx.user.id
  await handleApply(ctx, uid)
}

// 获取申请资源列表, 用于管理员审核
export const getApplyHis = async ctx => {
  await handleApply(ctx)
}

// 审核
export const updateApply = async ctx => {
  const { resources } = global.models
  const { body } = ctx.request
  const res = await resources.update(
    {
      // 0-未审核，1-已审核，2-驳回
      status: body.status || 1,
      msg: body.msg,
      // todo
      auditorId: 1,
      nid: body.nid,
    },
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

// 获取用户已申请所有资源
export const getUsersResources = async ctx => {
  const { id } = ctx.query
  const { resources } = global.models
  const res = await resources.findAndCountAll({
    where: {
      uid: id || ctx.user.id,
      status: 1,
    },
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
      msg: '查询资源失败',
    }
  }
}

// 获取组织已有资源的总量
export const getGroupResources = async ctx => {
  const { id } = ctx.query
  let tmpId = []
  const { groups_nodes, nodes, groups, users_group } = global.models
  if (!id) {
    // 如果id为空，查询当前用户的groupId
    const res = await users_group.findAll({
      where: {
        uid: ctx.user.id,
      },
      raw: true,
    })
    if (res && res.length) {
      tmpId = res.map(item => item.gid)
    } else {
      ctx.body = {
        code: 200,
        data: [],
        total: 0,
        msg: '用户未分配组织',
      }
      return
    }
  } else if (id.indexOf(',') !== -1) {
    tmpId = id.split(',')
  }
  const groupData = await groups.findAll({ raw: true })
  const ids = []
  if (tmpId.length) {
    tmpId.forEach(item => {
      ids.push(...getAllPids(groupData, parseInt(item, 10)))
    })
  }
  // 判断组织是否存在
  if (ids.length === 0) {
    ctx.body = {
      code: 200,
      data: [],
      total: 0,
      msg: '用户未分配组织',
    }
    return
  }
  const res = await nodes.findAndCountAll({
    attributes: Object.keys(
      omit(nodes.rawAttributes, ['password', 'port', 'sshPort'])
    ),
    include: [
      {
        model: groups_nodes,
        where: {
          gid: {
            [Op.in]: ids,
          },
        },
      },
    ],
  })
  if (res && res.rows) {
    // const
    ctx.body = {
      code: 200,
      data: res.rows,
      total: res.count,
    }
  } else {
    ctx.body = {
      code: 500,
      msg: '查询失败，请重试',
    }
  }
}

// 获取组织所有的资源，统计
export const getGroupResourcesCount = async ctx => {
  const { groups_nodes, nodes, groups } = global.models
  const res = await groups_nodes.findAll({
    attributes: ['gid'],
    include: [
      {
        model: groups,
        attributes: ['name', 'pid'],
      },
      {
        model: nodes,
        attributes: [
          [fn('SUM', col('cpu')), 'cpu_sum'],
          [fn('SUM', col('mem')), 'mem_sum'],
          [fn('SUM', col('disk')), 'disk_sum'],
          [fn('SUM', col('gpu')), 'gpu_sum'],
        ],
      },
    ],
    // raw: true,
    group: ['groups_nodes.gid', 'group.name', 'group.pid'],
  })
  ctx.body = {
    code: 200,
    data: res,
    // total: res.count,
  }
}

// 资源模板相关的CURD
export const getResourceTemplate = async ctx => {
  const { pageSize, current, name, cpu, mem, disk, gpu } = ctx.query
  const { resources_template } = global.models
  let where = {}
  if (name) {
    const nameCond = { name: { [Op.like]: `%${name}%` } }
    where = { ...where, ...nameCond }
  }
  if (cpu) {
    const cpuCond = { cpu: { [Op.gte]: parseInt(cpu, 10) } }
    where = { ...where, ...cpuCond }
  }
  if (mem) {
    const memCond = { mem: { [Op.gte]: parseInt(mem, 10) } }
    where = { ...where, ...memCond }
  }
  if (disk) {
    const diskCond = { disk: { [Op.gte]: parseInt(disk, 10) } }
    where = { ...where, ...diskCond }
  }
  if (gpu) {
    const gpuCond = { gpu: { [Op.gte]: parseInt(gpu, 10) } }
    where = { ...where, ...gpuCond }
  }
  const conditions = {
    order: [
      // ['created', 'DESC'],
      ['cpu', 'ASC'],
      ['mem', 'ASC'],
      ['disk', 'ASC'],
      ['gpu', 'ASC'],
    ],
    limit: parseInt(pageSize, 10) || 10,
    offset: (parseInt(current || 1, 10) - 1) * (parseInt(pageSize, 10) || 10),
  }
  const res = await resources_template.findAndCountAll({
    where,
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
      msg: '获取模板数据失败',
    }
  }
}

export const addResourceTemplate = async ctx => {
  const { resources_template } = global.models
  const { body } = ctx.request
  const res = await resources_template.create({ ...body })
  ctx.body = {
    code: 200,
    data: res,
  }
}

export const editResourceTemplate = async ctx => {
  const { resources_template } = global.models
  const { body } = ctx.request
  if (body.id) {
    const res = await resources_template.update(
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

export const removeResourceTemplate = async ctx => {
  const { resources_template } = global.models
  const { id } = ctx.params

  const idCond = id
    ? {
        [Op.or]: [{ id }],
      }
    : null
  const res = await resources_template.destroy({
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
