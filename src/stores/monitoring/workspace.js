import { action, observable } from 'mobx'
import { get } from 'lodash'

import { to } from 'utils'

import Base from './base'
import Devops from '../devops'

export default class WorkspaceMonitor extends Base {
  @observable
  statistics = {
    data: {},
    isLoading: false,
  }

  @observable
  resourceMetrics = {
    originData: {},
    data: {},
    isLoading: false,
  }

  getApi = ({ workspace }) =>
    workspace
      ? `${this.apiVersion}/workspaces/${workspace}`
      : `${this.apiVersion}/cluster`

  @action
  async fetchStatistics(workspace) {
    this.statistics.isLoading = true

    const params = {
      type: 'statistics',
    }
    const api = this.getApi({ workspace })
    const result = await to(request.get(api, params))
    const data = this.getResult(result)

    this.statistics = {
      data,
      isLoading: false,
    }

    return data
  }

  @action
  async getDevopsCount(workspace) {
    const devopsStore = new Devops()

    const result = await request.get(devopsStore.getDevOpsUrl({ workspace }), {
      paging: 'limit=Infinity',
    })

    const totalCount =
      result && result.items.length > 0 ? result.items.length : 0

    return totalCount
  }

  @action
  async fetchApplicationResourceMetrics({
    workspace,
    namespace,
    autoRefresh = false,
    ...filters
  }) {
    if (autoRefresh) {
      filters.last = true
    } else {
      this.resourceMetrics.isLoading = true
    }

    if (filters.cluster) {
      this.cluster = filters.cluster
    }

    const params = this.getParams(filters)

    // set correct path
    const paramsReg = /^[a-zA-Z]+_/g
    const metricType = get(filters.metrics, '[0]', '').replace(
      paramsReg,
      'workspace_'
    )
    let path = 'workspaces'

    if (workspace && workspace !== 'all') {
      path = `workspaces/${workspace}`
    }
    if (namespace && namespace !== 'all') {
      path = `namespaces/${namespace}`
      params.metrics_filter = `${metricType.replace(paramsReg, 'namespace_')}$`
    }

    const result = await to(request.get(`${this.apiVersion}/${path}`, params))

    let data = this.getResult(result)
    if (autoRefresh) {
      data = this.getRefreshResult(data, this.resourceMetrics.originData)
    }

    this.resourceMetrics = {
      originData: data,
      data: get(Object.values(data), '[0].data.result', {}),
      isLoading: false,
    }

    return data
  }
}
