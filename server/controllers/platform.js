const { omit } = require('lodash')

const { Op } = require('sequelize')
const { imageCommit, imagePush } = require('../libs/platform')

const resUsage = require('@/models/views/resources_usage_view')
const { getServerConfig } = require('@/libs/utils')

// 申请资源
export const applyRes = async ctx => {
  const { body } = ctx.request
  const { resources } = global.models
  // const res = await models.resources.findAll()
  // console.log('🚀 ~ file: platform.js ~ line 6 ~ res', res)
  const { uid, cpu, mem, gpu, disk, reason, type, app } = body
  const res = await resources.create({
    uid: parseInt(uid, 10),
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

// 获取申请资源列表
export const getApply = async ctx => {
  const params = ctx.query
  const { limit, start, type, name } = params
  const { resources, users } = global.models
  let whereState = {}
  if (type || name) {
    whereState = {
      status: {
        [Op.eq]: parseInt(type, 10),
      },
      // reason: {
      //   [Op.like]: name,
      // },
    }
  }
  const res = await resources.findAll({
    where: whereState,
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
  const resCount = await resources.findAndCountAll({
    where: whereState,
  })
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

// 获取节点列表
export const getNodes = async ctx => {
  // todo 组织未实现
  // eslint-disable-next-line no-unused-vars
  const { body } = ctx.request
  // 1.获取用户组织, 节点id
  // 2.获取nodes列表
  const { nodes } = global.models
  const res = await nodes.findAll({})
  // 3.获取nodes资源应用占用情况
  const nodesUsage = await resUsage()
  const obj = {}
  nodesUsage.forEach(item => {
    obj[item.nid] = {
      ...item.dataValues,
    }
  })
  const allNodes = res.map(item => {
    const node = omit(item.dataValues, [
      'password',
      'sshPort',
      'remark',
      'cert',
    ])
    const { id: nid } = node
    if (obj[nid]) {
      node.cpuRest = node.cpu - parseInt(obj[nid].cpuUsage, 10)
      node.memRest = node.mem - parseInt(obj[nid].memUsage, 10)
      node.diskRest = node.disk - parseInt(obj[nid].diskUsage, 10)
      node.gpuRest = node.gpu - parseInt(obj[nid].gpuUsage, 10)
    } else {
      node.cpuRest = node.cpu
      node.memRest = node.mem
      node.diskRest = node.disk
      node.gpuRest = node.gpu
    }
    return node
  })
  // 4.返回列表

  ctx.body = {
    code: 200,
    data: allNodes,
  }
}

// 容器固化
export const saveDocker = async ctx => {
  try {
    const { body } = ctx.request
    const { hubInfo, imageInfo, nodeIp, containerID } = body
    const serverConfig = getServerConfig().server
    const { nodeInfo } = serverConfig
    const sshOptions = {
      host: nodeIp,
      username: nodeInfo.username || 'root',
      password: nodeInfo.password || 'root',
      port: nodeInfo.port || 22,
    }
    const res = await imageCommit(
      {
        imageInfo,
        containerID: containerID.substr(9, 12),
      },
      sshOptions
    )
    await imagePush(
      {
        hubInfo,
        imageInfo,
      },
      sshOptions
    )
    ctx.body = {
      code: 200,
      data: res,
    }
  } catch (error) {
    ctx.body = {
      code: 500,
      msg: 'docker镜像提交失败',
    }
    global.logError.error(`saveDocker error: ${error}`)
  }
}

// 复制
export const copyApp = async ctx => {
  ctx.body = {
    code: 200,
  }
}
