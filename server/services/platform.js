import { get } from 'lodash'
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

// 获取应用列表
export const getK8sAppList = async ({ workspace, namespace }) => {
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
        created: get(item, 'cluster.create_time'),
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
        created: get(metadata, 'creationTimestamp'),
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
      })
      if (status.components && status.components.length > 0) {
        for (let j = 0; j < status.components.length; j++) {
          const app = status.components[j]
          apps.push({
            app: get(metadata, 'name'),
            type: get(app, 'kind'),
            name: get(app, 'name'),
            meta: JSON.stringify(app),
          })
        }
      }
    })
  }
  arr = arr.map(i => ({ ...i, status: i.status ? 1 : 0 }))

  // 保存用户应用信息 与 应用详情
  const { users_app, app_detail } = global.models
  const result = await users_app.bulkCreate(arr, {
    updateOnDuplicate: Object.keys(users_app.rawAttributes),
  })
  const result1 = await app_detail.bulkCreate(apps, {
    updateOnDuplicate: Object.keys(app_detail.rawAttributes),
  })
  return { result, template: res, custom: res1, apps: result1 }
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
    const { nodes, nodes_log } = global.models
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
      await nodes_log.bulkCreate(logs)
    }

    return { items, metrics: results || [] }
  }
  return res
}

// 获取harbar镜像信息
