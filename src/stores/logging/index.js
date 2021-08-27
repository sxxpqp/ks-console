import { observable, action } from 'mobx'

export default class LoggingStore {
  @observable
  isLoading = false

  @observable
  pathParams = {}

  @observable
  data = []

  constructor(state = {}) {
    Object.getOwnPropertyNames(state).forEach(prop => {
      this[prop] = state[prop]
    })
  }

  get apiVersion() {
    return 'kapis/logging.kubesphere.io/v1alpha2'
  }

  getApiPath(cluster) {
    return cluster
      ? `kapis/clusters/${cluster}/tenant.kubesphere.io/v1alpha2/logs`
      : 'kapis/tenant.kubesphere.io/v1alpha2/logs'
  }

  @action
  async request(params = {}, method = 'get') {
    this.isLoading = true

    const { start_time, end_time, cluster, ...rest } = params

    const res = await request[method](this.getApiPath(cluster), {
      ...rest,
      start_time: start_time ? Math.floor(start_time / 1000) : undefined,
      end_time: end_time ? Math.floor(end_time / 1000) : undefined,
    })

    this.isLoading = false

    return res
  }
}
