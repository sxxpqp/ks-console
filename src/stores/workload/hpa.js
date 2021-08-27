import { action } from 'mobx'

import { getHpaFormattedData } from 'utils/workload'

import Base from '../base'

export default class HpaStore extends Base {
  module = 'horizontalpodautoscalers'

  @action
  create(data, params) {
    return this.submitting(
      request.post(this.getListUrl(params), getHpaFormattedData(data))
    )
  }

  @action
  async patch(params, newObject) {
    await this.submitting(
      request.patch(this.getDetailUrl(params), getHpaFormattedData(newObject))
    )
  }

  @action
  reset() {
    this.detail = {}
  }
}
