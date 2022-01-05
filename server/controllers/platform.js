// const { omit } from 'lodash'

import { Op } from 'sequelize'
import axios from 'axios'
import qs from 'qs'
import { imageCommit, imagePush } from '../libs/platform'

import { getServerConfig } from '@/libs/utils'
import {
  getUserRepoInfo,
  getUserRepos,
  getImagesArtifacts,
} from '../libs/harbor'

// 获取节点列表
// deperated
// export const getNodes = async ctx => {
//   // todo 组织未实现
//   // eslint-disable-next-line no-unused-vars
//   const { body } = ctx.request
//   // 1.获取用户组织, 节点id
//   // 2.获取nodes列表
//   const { nodes } = global.models
//   const res = await nodes.findAll({})
//   // 3.获取nodes资源应用占用情况
//   const nodesUsage = await resUsage()
//   const obj = {}
//   nodesUsage.forEach(item => {
//     obj[item.nid] = {
//       ...item.dataValues,
//     }
//   })
//   const allNodes = res.map(item => {
//     const node = omit(item.dataValues, [
//       'password',
//       'sshPort',
//       'remark',
//       'cert',
//     ])
//     const { id: nid } = node
//     if (obj[nid]) {
//       node.cpuRest = node.cpu - parseInt(obj[nid].cpuUsage, 10)
//       node.memRest = node.mem - parseInt(obj[nid].memUsage, 10)
//       node.diskRest = node.disk - parseInt(obj[nid].diskUsage, 10)
//       node.gpuRest = node.gpu - parseInt(obj[nid].gpuUsage, 10)
//     } else {
//       node.cpuRest = node.cpu
//       node.memRest = node.mem
//       node.diskRest = node.disk
//       node.gpuRest = node.gpu
//     }
//     return node
//   })
//   // 4.返回列表

//   ctx.body = {
//     code: 200,
//     data: allNodes,
//   }
// }

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

// 翻译
export const handlerTransfer = async ctx => {
  const { body } = ctx.request
  const { text } = body
  const arr = text.match(/.{1,5000}/g)
  const result = []

  for (const item of arr) {
    try {
      const r = await axios.post(
        `https://api-free.deepl.com/v2/translate`,
        qs.stringify({
          auth_key: global.server.auth_key,
          text: item,
          target_lang: 'ZH',
        }),
        {
          headers: {
            Host: 'api-free.deepl.com',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )
      // console.log(r.data)
      result.push(r.data.translations[0].text)
    } catch (error) {
      global.appError.error(`handlerTransfer error: ${error}`)
    }
  }

  ctx.body = {
    code: 200,
    data: result.join(''),
  }
}

// 获取节点
export const getNodes = async ctx => {
  const { name, gid, status, current, pageSize } = ctx.query
  const cond = {
    limit: parseInt(pageSize, 10) || 10,
    offset: (parseInt(current || 1, 10) - 1) * (parseInt(pageSize, 10) || 10),
  }
  const nameCond = name
    ? {
        [Op.or]: [
          { name: { [Op.like]: `%${name}%` } },
          { node: { [Op.like]: `%${name}%` } },
        ],
      }
    : null

  const statusConf =
    status && status !== '-1'
      ? {
          status:
            status === '0' ? { [Op.eq]: `Running` } : { [Op.ne]: 'Running' },
        }
      : null
  const gidCond = gid
    ? { where: { gid: { [Op.eq]: parseInt(gid, 10) } } }
    : null
  // todo
  // 查询 token -> username
  // 查询 user -> group -> groups_nodes -> nodes
  const { nodes, nodes_log, groups_nodes, groups } = global.models
  const res = await nodes.findAndCountAll({
    where: {
      ...nameCond,
      ...statusConf,
    },
    include: [
      {
        model: nodes_log,
        order: [['created', 'DESC']],
        limit: 1,
      },
      {
        model: groups_nodes,
        ...gidCond,
        include: [
          {
            model: groups,
          },
        ],
      },
    ],
    ...cond,
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
      msg: '查询失败',
    }
  }
}

// 编辑节点
export const editNodes = async ctx => {
  const { body } = ctx.request
  const { name, gid, machine } = body
  let res1
  let res2
  if (name) {
    const { nodes } = global.models
    res1 = await nodes.update(
      { name },
      {
        where: {
          machine,
        },
      }
    )
  }
  if (gid) {
    const { groups_nodes } = global.models
    res2 = await groups_nodes
      .findAll({
        where: {
          machine,
        },
      })
      .then(item => {
        if (item && item.length > 0) {
          // update
          return groups_nodes.update(
            {
              gid,
            },
            {
              where: { machine },
            }
          )
        }
        // create
        return groups_nodes.create({
          machine,
          gid,
        })
      })
  }
  if (res1 && res2) {
    ctx.body = {
      code: 200,
      msg: '设置成功',
    }
  } else {
    ctx.body = {
      code: 500,
      msg: `更新失败, res1${res1}`,
    }
  }
}

// 添加节点
// todo

// 删除节点
// todo

// 获取镜像
export const getImages = async ctx => {
  const { harborPid, username } = ctx.user
  const { name, pageSize, current, type } = ctx.query
  const result = {}
  try {
    if (type === '1') {
      const summary = await getUserRepoInfo(harborPid)
      if (summary && summary.status === 200) {
        result.summary = summary.data
      }
      const repos = await getUserRepos(
        username,
        parseInt(pageSize, 10) || 10,
        parseInt(current, 10) || 1,
        name
      )
      if (repos && repos.status === 200) {
        result.data = repos.data
        const { headers } = repos
        result.total = headers['x-total-count']
      }
    } else if (type === '2') {
      const { harbor } = global.server
      const summary = await getUserRepoInfo(harbor.pid)
      if (summary && summary.status === 200) {
        result.summary = summary.data
      }
      const repos = await getUserRepos(
        harbor.project,
        parseInt(pageSize, 10) || 10,
        parseInt(current, 10) || 1,
        name
      )
      if (repos && repos.status === 200) {
        result.data = repos.data
        const { headers } = repos
        result.total = headers['x-total-count']
      }
    }
    // 查询用户repo
    ctx.body = {
      code: 200,
      ...result,
    }
  } catch (error) {
    ctx.body = {
      code: 500,
      msg: '请求异常，请重试',
    }
  }
}

// 获取镜像的tags详情
export const getImagesDetail = async ctx => {
  const { name, pageSize, current } = ctx.query
  // const user = ctx.user
  const [projects, repo] = name.split('/')
  try {
    const res = await getImagesArtifacts(projects, repo, pageSize, current)
    if (res && res.status === 200) {
      ctx.body = {
        code: 200,
        msg: '查询成功',
        data: res.data,
        total: res.headers['x-total-count'],
      }
    } else {
      ctx.body = {
        code: 500,
        msg: 'harbor镜像服务异常',
        data: [],
      }
    }
  } catch (error) {
    ctx.body = {
      code: 500,
      msg: '查询失败，请重试',
    }
  }
}

// 获取告警消息
export const getAlertMessage = async ctx => {
  const {
    msg,
    status,
    level,
    read,
    rule,
    current,
    pageSize,
    nolimit = false,
  } = ctx.query
  const conditions = !nolimit
    ? {
        order: [['created', 'DESC']],
        limit: parseInt(pageSize, 10) || 10,
        offset:
          (parseInt(current || 1, 10) - 1) * (parseInt(pageSize, 10) || 10),
      }
    : {
        order: [['created', 'DESC']],
      }
  const user = ctx.user
  const { alerts } = global.models
  let where = {
    namespace: user.namespace,
  }
  if (msg) {
    const nameCond = { msg: { [Op.like]: `%${msg}%` } }
    where = { ...where, ...nameCond }
  }
  if (rule) {
    const ruleCond = { rule: { [Op.like]: `%${rule}%` } }
    where = { ...where, ...ruleCond }
  }
  if (status) {
    const statusCond = {
      status,
    }
    where = { ...where, ...statusCond }
  }
  if (level) {
    const levelCond = {
      level,
    }
    where = { ...where, ...levelCond }
  }
  if (read) {
    const readCond = {
      read,
    }
    where = { ...where, ...readCond }
  }
  const res = await alerts.findAndCountAll({
    where,
    conditions,
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
      msg: '查询失败',
    }
  }
}

// 设置告警消息已读
export const updateAlertMessage = async ctx => {
  const { body } = ctx.request
  const { alerts } = global.models
  const res = await alerts.update(
    {
      read: 1,
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
