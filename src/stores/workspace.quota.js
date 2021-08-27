import Base from 'stores/base'
import { action } from 'mobx'

export default class QuotaStore extends Base {
  module = 'resourcequotas'

  get apiVersion() {
    return 'kapis/tenant.kubesphere.io/v1alpha2'
  }

  getPath({ cluster, workspace } = {}) {
    let path = ''
    if (cluster) {
      path += `/klusters/${cluster}`
    }
    if (workspace) {
      path += `/workspaces/${workspace}`
    }
    return path
  }

  @action
  async fetchDetail(params) {
    this.isLoading = true

    const result = await request.get(
      this.getDetailUrl(params),
      {},
      {},
      () => {}
    )
    const detail = { ...params, ...this.mapper(result) }

    this.detail = detail
    this.isLoading = false
    return detail
  }
}
