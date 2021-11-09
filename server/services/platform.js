import { get } from 'lodash'
import axios from '../libs/axios'

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
  return res
}

// 获取harbar镜像信息
