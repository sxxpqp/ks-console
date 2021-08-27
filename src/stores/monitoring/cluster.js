import { action, observable } from 'mobx'
import { get } from 'lodash'

import { to } from 'utils'

import Base from './base'

export default class ClusterMonitoring extends Base {
  @observable
  statistics = {
    data: {},
    isLoading: false,
  }

  @observable
  resourceMetrics = {
    originData: {},
    data: [],
    isLoading: false,
  }

  @action
  async fetchStatistics() {
    this.statistics.isLoading = true

    const params = {
      type: 'statistics',
    }
    const result = await to(request.get(this.getApi(), params))
    const data = this.getResult(result)

    this.statistics = {
      data,
      isLoading: false,
    }

    return data
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
      this.resourceMetrics.isRefreshing = true
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
      'cluster_'
    )
    let path = 'cluster'

    if (workspace) {
      path = `workspaces/${workspace}`
      params.metrics_filter = `${metricType.replace(paramsReg, 'workspace_')}$`
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
      data: get(Object.values(data), '[0].data.result') || [],
      isLoading: false,
      isRefreshing: false,
    }

    return data
  }

  fetchClusterDevopsCount = async () => {
    const result = await request.get(
      'kapis/tenant.kubesphere.io/v1alpha2/devopscount/'
    )

    return get(result, 'count', 0)
  }
}
