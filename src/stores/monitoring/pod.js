import { action, observable } from 'mobx'
import { isEmpty, omit } from 'lodash'

import { to } from 'utils'

import Base from './base'

export default class PodMonitor extends Base {
  @observable
  sort = {
    data: {},
    page: 1,
    limit: 10,
    total: 0,
    isLoading: false,
  }

  resourceName = 'pod'

  getApi = ({ nodeName, namespace, workloadKind, workloadName, pod }) => {
    let path = namespace ? `/namespaces/${namespace}` : '/'

    if (workloadKind && workloadName) {
      path = `${path}/workloads/${workloadKind}/${workloadName}`
    }

    if (nodeName) {
      path = `/nodes/${nodeName}`
    }

    if (!pod) {
      return `${this.apiVersion}${path}/pods`
    }

    return `${this.apiVersion}${path}/pods/${pod}`
  }

  handleParams = params =>
    omit(params, [
      'nodeName',
      'namespace',
      'workloadKind',
      'workloadName',
      'pod',
    ])

  @action
  async fetchSortedMetrics({ limit, page, more, metrics = [], ...filters }) {
    this.sort.isLoading = true

    const params = {}

    if (!isEmpty(metrics)) {
      params.sort_metric = metrics.join('|')
    }

    params.limit = limit || 10
    params.page = page || 1

    if (filters.cluster) {
      this.cluster = filters.cluster
    }

    const api = this.getApi(filters)
    const result = await to(request.get(api, params))

    let data = this.getResult(result.results)
    if (more) {
      data = this.getMoreResult(data, this.sort.data)
    }

    this.sort = {
      data,
      total: result.total_item || 0,
      limit: Number(result.limit || 10),
      page: Number(result.page || 1),
      isLoading: false,
    }
    return data
  }
}
