import { get } from 'lodash'
import { action, observable } from 'mobx'

import { processTopology } from './utils'

export default class BaseStore {
  topologies = {}

  @observable
  detail = {}

  @observable
  isLoading = true

  @observable
  isSubmitting = false

  constructor(module) {
    this.module = module
  }

  getPath({ cluster, namespace }) {
    let path = ''
    if (cluster) {
      path += `/klusters/${cluster}`
    }
    if (namespace) {
      path += `/namespaces/${namespace}`
    }
    return path
  }

  getListUrl = params =>
    `kapis/network.kubesphere.io/v1alpha2${this.getPath(params)}/topology`

  getDetailUrl = params => `${this.getListUrl(params)}/${params.name}`

  @action
  async fetchList(params) {
    this.isLoading = true

    const result = await request.get(this.getListUrl(params), params)

    this.topologies = processTopology(get(result, 'nodes', {}))

    this.isLoading = false
  }

  @action
  async fetchDetail(params) {
    this.isLoading = true

    const result = await request.get(this.getDetailUrl(params))

    this.detail = result
    this.isLoading = false
  }
}
