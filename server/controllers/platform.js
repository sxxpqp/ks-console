// 申请资源
export const applyRes = async ctx => {
  const { body } = ctx.request
  const { resources } = global.models
  // const res = await models.resources.findAll()
  // console.log('🚀 ~ file: platform.js ~ line 6 ~ res', res)
  const { uid, cpu, mem, gpu, disk, reason, type } = body
  const res = await resources.create({
    uid: parseInt(uid, 10),
    cpu: parseInt(cpu, 10),
    mem: parseInt(mem, 10),
    gpu: parseInt(gpu, 10),
    disk: parseInt(disk, 10),
    type,
    reason,
  })
  ctx.body = {
    code: 200,
    data: res,
  }
}

// 获取申请资源列表
export const getApply = async ctx => {
  const params = ctx.query
  const { limit, start } = params
  const { resources, users } = global.models
  const res = await resources.findAll({
    order: [['created', 'desc']],
    limit: parseInt(limit || 10, 10),
    offset: parseInt(start || 0, 10),
    include: [
      {
        model: users,
        attributes: ['id', 'name'],
        as: 'uid_user',
      },
    ],
  })
  const resCount = await resources.findAndCountAll({})
  ctx.body = {
    code: 200,
    data: res,
    total_count: resCount.count,
  }
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

// 获取节点列表
export const getNodes = async ctx => {
  // 1.获取用户组织
  // 2.获取nodes列表
  // 3.获取nodes资源应用占用情况 审核通过
  // 4.返回列表
  ctx.body = {
    code: 200,
  }
}
