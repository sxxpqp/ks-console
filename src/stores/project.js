import { get, omit } from 'lodash'
import { action, observable } from 'mobx'
import { LIST_DEFAULT_ORDER } from 'utils/constants'
import ObjectMapper from 'utils/object.mapper'

import Base from './base'
import List from './base.list'

const withTypeSelectParams = (params, type) => {
  if (type === 'system') {
    params.labelSelector = 'kubesphere.io/workspace=system-workspace'
  } else if (type === 'user') {
    params.labelSelector =
      'kubesphere.io/workspace!=system-workspace,!kubesphere.io/kubefed-host-namespace,!kubesphere.io/devopsproject'
  } else {
    params.labelSelector =
      params.labelSelector ||
      `!kubesphere.io/kubefed-host-namespace,!kubesphere.io/devopsproject`
  }

  return params
}

export default class ProjectStore extends Base {
  @observable
  initializing = true

  limitRanges = new List()

  module = 'namespaces'

  @observable
  statics = {
    app: 0,
    pods: 0,
    error: 0,
  }

  getResourceUrl = ({ workspace, ...params }) => {
    if (workspace) {
      return `kapis/tenant.kubesphere.io/v1alpha2/workspaces/${workspace}${this.getPath(
        params
      )}/namespaces`
    }

    return `kapis/resources.kubesphere.io/v1alpha3${this.getPath(
      params
    )}/namespaces`
  }

  getWatchListUrl = ({ workspace, ...params }) => {
    if (workspace) {
      return `${this.apiVersion}/watch${this.getPath(
        params
      )}/namespaces?labelSelector=kubesphere.io/workspace=${workspace}`
    }
    return `${this.apiVersion}/watch${this.getPath(params)}/namespaces`
  }

  getListUrl = (params = {}) => {
    if (params.workspace) {
      return `kapis/tenant.kubesphere.io/v1alpha2/workspaces/${
        params.workspace
      }${this.getPath(params)}/namespaces`
    }

    return `${this.apiVersion}${this.getPath(params)}/namespaces`
  }

  @action
  setStatics(data) {
    this.statics = data
  }

  @action
  async fetchList({
    cluster,
    workspace,
    namespace,
    more,
    type,
    ...params
  } = {}) {
    this.list.isLoading = true

    if (!params.sortBy && params.ascending === undefined) {
      params.sortBy = LIST_DEFAULT_ORDER[this.module] || 'createTime'
    }

    if (params.limit === Infinity || params.limit === -1) {
      params.limit = -1
      params.page = 1
    }

    params.limit = params.limit || 10

    const result =
      (await request
        .get(
          this.getResourceUrl({ cluster, workspace, namespace }),
          withTypeSelectParams(params, type)
        )
        .catch(() => {})) || {}

    const data = get(result, 'items', []).map(item => ({
      cluster,
      ...this.mapper(item),
    }))

    this.list.update({
      data: more ? [...this.list.data, ...data] : data,
      total: result.totalItems || result.total_count || data.length || 0,
      ...omit(params, 'labelSelector'),
      cluster: globals.app.isMultiCluster ? cluster : undefined,
      limit: Number(params.limit) || 10,
      page: Number(params.page) || 1,
      isLoading: false,
      ...(this.list.silent ? {} : { selectedRowKeys: [] }),
    })

    return data
  }

  @action
  async fetchDetail({ cluster, workspace, namespace }, reject) {
    this.isLoading = true
    const detail = await request.get(
      this.getDetailUrl({ cluster, workspace, name: namespace }),
      null,
      null,
      reject ||
        (res => {
          if (res.reason === 'NotFound' || res.reason === 'Forbidden') {
            global.navigateTo('/404')
          }
        })
    )

    this.detail = { cluster, ...this.mapper(detail) }

    this.isLoading = false
  }

  @action
  async create(data, params = {}) {
    if (params.workspace) {
      return this.submitting(request.post(this.getResourceUrl(params), data))
    }

    return this.submitting(request.post(this.getListUrl(params), data))
  }

  @action
  async fetchLimitRanges({ cluster, namespace }) {
    this.limitRanges.isLoading = false
    const result = await request.get(
      `api/v1${this.getPath({ cluster, namespace })}/limitranges`
    )
    const data = result.items.map(ObjectMapper.limitranges)

    this.limitRanges.update({
      data,
      total: result.items.length,
      isLoading: false,
    })

    return data
  }

  @action
  async fetchListByUser({
    cluster,
    workspace,
    namespace,
    username,
    type,
    ...params
  } = {}) {
    this.list.isLoading = true

    if (!params.sortBy && params.ascending === undefined) {
      params.sortBy = LIST_DEFAULT_ORDER[this.module] || 'createTime'
    }

    if (params.limit === Infinity || params.limit === -1) {
      params.limit = -1
      params.page = 1
    }

    params.limit = params.limit || 10

    const result = await request.get(
      `kapis/tenant.kubesphere.io/v1alpha2/workspaces/${workspace}${this.getPath(
        { cluster, namespace }
      )}/workspacemembers/${username}/namespaces`,
      withTypeSelectParams(params, type)
    )
    const data = get(result, 'items', []).map(item => ({
      cluster,
      ...this.mapper(item),
    }))

    this.list.update({
      data,
      total: result.totalItems || 0,
      ...omit(params, 'labelSelector'),
      cluster: globals.app.isMultiCluster ? cluster : undefined,
      limit: Number(params.limit) || 10,
      page: Number(params.page) || 1,
      isLoading: false,
    })

    return data
  }
}
