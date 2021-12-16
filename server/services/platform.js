import { get, omit } from 'lodash'
import { Op } from 'sequelize'
import dayjs from 'dayjs'
import crypto from 'crypto'
import axios from '../libs/axios'
import {
  NodeMapper,
  getNodeStatus,
  getMetricValue,
  cpuFormat,
  memoryFormat,
  getValueByUnit,
  getConditionsStatus,
} from '../libs/nodes'
import { sshcmd } from '../libs/platform'

export const md5 = text => {
  return crypto
    .createHash('md5')
    .update(text)
    .digest('hex')
}

// 获取应用列表
export const getK8sAppList = async ({ workspace, namespace }) => {
  if (!(workspace && namespace)) return
  // 模板应用
  const tmpUrl = `/kapis/openpitrix.io/v1/workspaces/${workspace}/namespaces/${namespace}/applications?conditions=status%3Dcreating%7Cactive%7Cfailed%7Cdeleting%7Cupgrading%7Ccreated%7Cupgraded&orderBy=status_time&paging=limit%3D99999%2Cpage%3D1`
  // 模板应用详情
  const detailUrl = `/kapis/openpitrix.io/v1/workspaces/${workspace}/namespaces/${namespace}/applications/`
  // 自制应用
  const userUrl = `/kapis/resources.kubesphere.io/v1alpha3/namespaces/${namespace}/applications?sortBy=createTime`
  let arr = []
  const apps = []
  const res = await axios.get(tmpUrl)
  if (res && res.items) {
    for (let i = 0; i < res.items.length; i++) {
      const item = res.items[i]
      const detail = await axios.get(
        detailUrl + get(item, 'cluster.cluster_id')
      )
      const { releaseInfo } = detail
      arr.push({
        name: get(item, 'cluster.description') || get(item, 'cluster.name'),
        status: get(item, 'cluster.status') === 'active',
        type: 0,
        appId: get(item, 'cluster.cluster_id'),
        created: dayjs(get(item, 'cluster.create_time')).format(
          'YYYY-MM-DD HH:mm:ss'
        ),
        updated: get(item, 'cluster.status_time'),
        meta: JSON.stringify(item),
        deployments: releaseInfo
          ? releaseInfo.filter(
              o => o.kind === 'Deployment' || o.kind === 'StatefulSet'
            ).length
          : 0,
        services: releaseInfo
          ? releaseInfo.filter(o => o.kind === 'Service').length
          : 0,
        namespace,
        workspace,
        username: get(item, 'cluster.owner'),
      })
      // detail信息
      if (releaseInfo && releaseInfo.length > 0) {
        for (let j = 0; j < releaseInfo.length; j++) {
          const app = releaseInfo[j]
          apps.push({
            app: get(item, 'cluster.cluster_id'),
            type: get(app, 'kind'),
            name: get(app, 'metadata.name'),
            meta: JSON.stringify(releaseInfo[j]),
            namespace,
            workspace,
          })
        }
      }
    }
  }

  const checkReady = value => {
    const tmp = value.indexOf('/') !== -1 ? value.split('/') : []
    if (tmp && tmp.length > 0) {
      return parseInt(tmp[0], 10) / parseInt(tmp[1], 10) === 1
    }
    return false
  }

  const res1 = await axios.get(userUrl)
  if (res1 && res1.items) {
    res1.items.forEach(i => {
      const { metadata, status } = i
      arr.push({
        name:
          get(metadata, 'annotations["kubesphere.io/alias-name"]') ||
          get(metadata, 'name'),
        status: checkReady(get(status, 'componentsReady')),
        type: 1,
        appId: get(metadata, 'name'),
        created: dayjs(get(metadata, 'creationTimestamp')).format(
          'YYYY-MM-DD HH:mm:ss'
        ),
        // updated: get(i, 'cluster.status_time'),
        meta: JSON.stringify(i),
        deployments: status.components
          ? status.components.filter(
              o => o.kind === 'Deployment' || o.kind === 'StatefulSet'
            ).length
          : 0,
        services: status.components
          ? status.components.filter(o => o.kind === 'Service').length
          : 0,
        namespace,
        workspace,
        username: get(metadata, 'annotations["kubesphere.io/creator"]'),
      })
      if (status.components && status.components.length > 0) {
        for (let j = 0; j < status.components.length; j++) {
          const app = status.components[j]
          apps.push({
            app: get(metadata, 'name'),
            type: get(app, 'kind'),
            name: get(app, 'name'),
            meta: JSON.stringify(app),
            namespace,
            workspace,
          })
        }
      }
    })
  }
  arr = arr.map(i => ({
    ...i,
    status: i.status ? 1 : 0,
  }))

  // 保存用户应用信息 与 应用详情
  const { users_app, app_detail } = global.models
  const result = await users_app.bulkCreate(arr, {
    updateOnDuplicate: Object.keys(users_app.rawAttributes),
  })
  const appIds = result.map(i => i.appId)
  if (result && result.length > 0) {
    // 删除不存在列表中的应用
    await users_app.destroy({
      where: {
        workspace,
        namespace,
        appId: {
          [Op.notIn]: appIds,
        },
      },
    })
  }
  const result1 = await app_detail.bulkCreate(apps, {
    updateOnDuplicate: Object.keys(app_detail.rawAttributes),
  })
  if (result1 && result1.length > 0) {
    // 删除不存在列表中的应用
    await app_detail.destroy({
      where: {
        workspace,
        namespace,
        app: {
          [Op.notIn]: appIds,
        },
      },
    })
  }
  return {
    result,
    template: res,
    custom: res1,
    apps: result1,
  }
}

// 获取节点信息
export const getK8sNodes = async () => {
  const url = `/kapis/resources.kubesphere.io/v1alpha3/nodes`
  const res = await axios.get(url)
  if (res) {
    const items = res.items.map(i => NodeMapper(i))
    const resources = items.reduce((acc, cur) => {
      return [...acc, cur.name]
    }, [])
    // 获取状态信息
    const urlMetrics = `/kapis/monitoring.kubesphere.io/v1alpha3/nodes?resources_filter=${encodeURIComponent(
      resources.join('|')
    )}&metrics_filter=node_cpu_utilisation%7Cnode_cpu_usage%7Cnode_cpu_total%7Cnode_memory_utilisation%7Cnode_memory_usage_wo_cache%7Cnode_memory_total%7Cnode_disk_size_utilisation%7Cnode_disk_size_usage%7Cnode_disk_size_capacity%7Cnode_pod_utilisation%7Cnode_pod_running_count%7Cnode_pod_quota%7Cnode_disk_inode_utilisation%7Cnode_disk_inode_total%7Cnode_disk_inode_usage%7Cnode_load1%24%24`
    const { results } = await axios.get(urlMetrics)
    // 数据入库
    const { nodes, nodes_log, groups_nodes } = global.models
    const arr = []
    const logs = []
    if (items && items.length > 0) {
      items.forEach(item => {
        const { status } = item
        const { capacity } = status
        arr.push({
          node: item.name,
          machine: get(item, 'nodeInfo.machineID'),
          cpu: parseInt(capacity.cpu, 10),
          mem: getValueByUnit(
            getMetricValue(results, 'node_memory_total', item.name),
            'Gi'
          ),
          disk: getValueByUnit(
            getMetricValue(results, 'node_disk_size_capacity', item.name),
            'GB'
          ),
          gpu: 0, // todo
          inode: parseInt(
            getMetricValue(results, 'node_disk_inode_total', item.name),
            10
          ),
          pod: parseInt(capacity.pods, 10),
          ip: item.ip,
          status: getNodeStatus(item.status),
          conditions: JSON.stringify(item.conditions),
          role: JSON.stringify(item.role),
          taints: JSON.stringify(item.taints),
          cpu_used: parseFloat(
            getMetricValue(results, 'node_cpu_usage', item.name),
            10
          ),
          mem_used: getValueByUnit(
            getMetricValue(results, 'node_memory_usage_wo_cache', item.name),
            'Gi'
          ),
          disk_used: getValueByUnit(
            getMetricValue(results, 'node_disk_size_usage', item.name),
            'GB'
          ),
          gpu_used: 0, // todo
          inode_used: parseInt(
            getMetricValue(results, 'node_disk_inode_usage', item.name),
            10
          ),
          pod_used: parseInt(
            getMetricValue(results, 'node_pod_running_count', item.name),
            10
          ),
          cpu_limit: `${cpuFormat(
            get(item, 'annotations["node.kubesphere.io/cpu-limits"]')
          )}Core (${get(
            item,
            'annotations["node.kubesphere.io/cpu-limits-fraction"]'
          )})`,
          cpu_request: `${cpuFormat(
            get(item, 'annotations["node.kubesphere.io/cpu-requests"]')
          )} Core (${get(
            item,
            'annotations["node.kubesphere.io/cpu-requests-fraction"]'
          )})`,
          mem_limit: `${memoryFormat(
            get(item, 'annotations["node.kubesphere.io/memory-limits"]'),
            'Gi'
          )}Gi (${get(
            item,
            'annotations["node.kubesphere.io/memory-limits-fraction"]'
          )})`,
          mem_request: `${memoryFormat(
            get(item, 'annotations["node.kubesphere.io/memory-requests"]'),
            'Gi'
          )} Gi (${get(
            item,
            'annotations["node.kubesphere.io/memory-requests-fraction"]'
          )})`,
        })
        logs.push({
          machine: get(item, 'nodeInfo.machineID'),
          net_health: getConditionsStatus(
            item.conditions.find(i => i.type === 'NetworkUnavailable')
          ),
          mem_health: getConditionsStatus(
            item.conditions.find(i => i.type === 'MemoryPressure')
          ),
          disk_pressure: getConditionsStatus(
            item.conditions.find(i => i.type === 'DiskPressure')
          ),
          pid_pressure: getConditionsStatus(
            item.conditions.find(i => i.type === 'PIDPressure')
          ),
          pod_ready: getConditionsStatus(
            item.conditions.find(i => i.type === 'Ready')
          ),
          cpu_used: parseFloat(
            getMetricValue(results, 'node_cpu_usage', item.name),
            10
          ),
          mem_used: getValueByUnit(
            getMetricValue(results, 'node_memory_usage_wo_cache', item.name),
            'Gi'
          ),
          disk_used: getValueByUnit(
            getMetricValue(results, 'node_disk_size_usage', item.name),
            'GB'
          ),
          gpu_used: 0, // todo
          inode_used: parseInt(
            getMetricValue(results, 'node_disk_inode_usage', item.name),
            10
          ),
          pod_used: parseInt(
            getMetricValue(results, 'node_pod_running_count', item.name),
            10
          ),
          cpu_limit: `${cpuFormat(
            get(item, 'annotations["node.kubesphere.io/cpu-limits"]')
          )}Core (${get(
            item,
            'annotations["node.kubesphere.io/cpu-limits-fraction"]'
          )})`,
          cpu_request: `${cpuFormat(
            get(item, 'annotations["node.kubesphere.io/cpu-requests"]')
          )} Core (${get(
            item,
            'annotations["node.kubesphere.io/cpu-requests-fraction"]'
          )})`,
          mem_limit: `${memoryFormat(
            get(item, 'annotations["node.kubesphere.io/memory-limits"]'),
            'Gi'
          )}Gi (${get(
            item,
            'annotations["node.kubesphere.io/memory-limits-fraction"]'
          )})`,
          mem_request: `${memoryFormat(
            get(item, 'annotations["node.kubesphere.io/memory-requests"]'),
            'Gi'
          )} Gi (${get(
            item,
            'annotations["node.kubesphere.io/memory-requests-fraction"]'
          )})`,
        })
      })
      await nodes.bulkCreate(arr, {
        updateOnDuplicate: Object.keys(arr[1]),
      })
      const machineIds = arr.map(i => i.machine)
      // 删除不在上面的id中的数据
      await nodes.destroy({
        where: {
          machine: {
            [Op.notIn]: machineIds,
          },
        },
      })
      await groups_nodes.destroy({
        where: {
          machine: {
            [Op.notIn]: machineIds,
          },
        },
      })
      // todo 调整k8s -> workspace的大小
      await nodes_log.bulkCreate(logs)
    }

    return { items, metrics: results || [] }
  }
  return res
}

// 获取harbar镜像信息

// 获取gpu信息
export const getGPUstatus = async () => {
  const { ssh } = global.server
  const res = await sshcmd('bash /root/gpu.sh', {
    host: ssh.host,
    port: ssh.port,
    username: ssh.username,
    password: ssh.password,
  })
  if (!res) return
  const arr = res.stdout.split('\n').slice(1)
  arr.forEach(async item => {
    //  ['Node Available(GPUs) Used(GPUs)', 'master 0 0', 'node1 0 0', 'node2 1 2']
    // 节点名称， 可用gpu数， 已用gpu数
    const { nodes } = global.models
    const nodeGPU = item.split(' ')
    await nodes.update(
      {
        gpu: nodeGPU[1],
        gpu_used:
          parseFloat(nodeGPU[1], 10) < parseFloat(nodeGPU[2])
            ? nodeGPU[1]
            : nodeGPU[2],
      },
      {
        where: {
          node: nodeGPU[0],
        },
      }
    )
  })
}

// 获取平台的告警信息，并存储
export const getAlertsMsg = async () => {
  const { users, alerts } = global.models
  const resInfo = await users.findAll({
    attributes: ['username', 'cluster', 'workspace', 'namespace'],
    raw: true,
  })
  const tmp = resInfo.filter(i => i.namespace !== null).map(i => i.namespace)
  const alertArr = []
  for (let i = 0; i < tmp.length; i++) {
    const item = tmp[i]
    const url = `/kapis/alerting.kubesphere.io/v2alpha1/namespaces/${item}/alerts?sortBy=createTime&limit=9999999`
    const res = await axios.get(url)
    const { total, items } = res
    if (total) {
      // 数据入库
      const info = resInfo.find(o => o.namespace === item)
      items.forEach(t => {
        const str = JSON.stringify(t)
        alertArr.push({
          id: md5(str),
          msg: get(t, 'annotations.summary'),
          type: 0,
          status: get(t, 'state'),
          level: get(t, 'labels.severity'),
          rule: get(t, 'annotations.aliasName') || t.ruleName,
          created: t.activeAt,
          read: 0,
          ...info,
          app: get(t, 'labels.workload'),
          meta: str,
        })
      })
    }
  }
  if (alertArr.length) {
    await alerts.bulkCreate(alertArr, {
      updateOnDuplicate: Object.keys(omit(alerts.rawAttributes, ['read'])),
    })
  }
}
