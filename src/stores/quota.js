import { action, observable } from 'mobx'

import Base from 'stores/base'

export default class QuotaStore extends Base {
  module = 'resourcequotas'

  @observable
  data = {}

  @action
  async fetch(params) {
    this.isLoading = true

    const result = await request.get(
      `kapis/resources.kubesphere.io/v1alpha2${this.getPath(params)}/quotas`
    )

    this.data = result.data

    this.isLoading = false
  }
}
