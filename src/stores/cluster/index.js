import { get, cloneDeep } from 'lodash'
import { action, observable } from 'mobx'

import { LIST_DEFAULT_ORDER, DEFAULT_CLUSTER } from 'utils/constants'

import Base from 'stores/base'
import List from 'stores/base.list'

export default class ClusterStore extends Base {
  @observable
  initializing = true

  @observable
  isAgentLoading = true

  @observable
  agent = ''

  @observable
  isValidating = false

  @observable
  version = ''

  module = 'clusters'

  @observable
  project = undefined

  projects = new List()

  getAgentUrl = ({ cluster }) =>
    `kapis/cluster.kubesphere.io/v1alpha1/clusters/${cluster}/agent/deployment`

  getTenantUrl = (params = {}) =>
    `kapis/tenant.kubesphere.io/v1alpha2${this.getPath(params)}/${this.module}`

  @action
  async fetchList({ from, more, ...params } = {}) {
    this.list.isLoading = true

    if (!params.sortBy && params.ascending === undefined) {
      params.sortBy = LIST_DEFAULT_ORDER[this.module] || 'createTime'
    }

    if (params.limit === Infinity || params.limit === -1) {
      params.limit = -1
      params.page = 1
    }

    params.limit = params.limit || 10

    let result
    if (!globals.app.isMultiCluster) {
      result = { items: [DEFAULT_CLUSTER] }
    } else if (
      from === 'resource' ||
      globals.app.hasPermission({ module: 'clusters', action: 'view' })
    ) {
      result = await request.get(this.getResourceUrl({}), params)
    } else {
      result = await request.get(this.getTenantUrl({}), params)
    }

    const data = get(result, 'items', []).map(this.mapper)

    this.list.update({
      data: more ? [...this.list.data, ...data] : data,
      total: result.totalItems || result.total_count || data.length || 0,
      ...params,
      limit: Number(params.limit) || 10,
      page: Number(params.page) || 1,
      isLoading: false,
      ...(this.list.silent ? {} : { selectedRowKeys: [] }),
    })

    return data
  }

  @action
  async fetchDetail(params) {
    this.isLoading = true

    let detail
    if (!globals.app.isMultiCluster) {
      detail = this.mapper(cloneDeep(DEFAULT_CLUSTER))
    } else {
      const result = await request.get(
        `${this.getResourceUrl(params)}/${params.name}`,
        null,
        null,
        (_, err) => {
          if (err.reason === 'Not Found') {
            global.navigateTo('/404')
          }
        }
      )
      detail = { ...params, ...this.mapper(result) }
    }

    this.detail = detail
    this.isLoading = false
    return detail
  }

  @action
  async fetchAgent(params) {
    this.isAgentLoading = true

    const result = await request.get(this.getAgentUrl(params))

    this.agent = result
    this.isAgentLoading = false
  }

  @action
  async validate(data) {
    this.isValidating = true
    await request.post(
      'kapis/cluster.kubesphere.io/v1alpha1/clusters/validation',
      data,
      {},
      (res, err) => {
        this.isValidating = false
        window.onunhandledrejection({
          status: 400,
          reason: t('Validation failed'),
          message: err.message,
        })
        return Promise.reject()
      }
    )
    this.isValidating = false
  }

  @action
  setProject(project) {
    this.project = project
  }

  @action
  async fetchProjects({ cluster, namespace, more, ...params } = {}) {
    this.projects.isLoading = true

    if (!params.sortBy && params.ascending === undefined) {
      params.sortBy = LIST_DEFAULT_ORDER[this.module] || 'createTime'
    }

    if (params.limit === Infinity || params.limit === -1) {
      params.limit = -1
      params.page = 1
    }

    params.limit = params.limit || 10

    const result = await request.get(
      `kapis/resources.kubesphere.io/v1alpha3${this.getPath({
        cluster,
        namespace,
      })}/namespaces`,
      {
        labelSelector:
          '!kubesphere.io/kubefed-host-namespace,!kubesphere.io/devopsproject',
        ...params,
      }
    )
    const data = get(result, 'items', []).map(item => ({
      cluster,
      ...this.mapper(item),
    }))

    this.projects.update({
      data: more ? [...this.projects.data, ...data] : data,
      total: result.totalItems || result.total_count || data.length || 0,
      ...params,
      limit: Number(params.limit) || 10,
      page: Number(params.page) || 1,
      isLoading: false,
      ...(this.projects.silent ? {} : { selectedRowKeys: [] }),
    })
  }

  @action
  async fetchVersion({ cluster }) {
    const result = await request.get(
      `kapis/clusters/${cluster}/version`.replace('/clusters/default', '')
    )

    this.version = get(result, 'kubernetes.gitVersion')
  }
}
