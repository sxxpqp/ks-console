import { action, observable } from 'mobx'
import ObjectMapper from 'utils/object.mapper'

import Base from './base'

export default class RouterStore extends Base {
  @observable
  gateway = {
    data: {},
    isLoading: true,
  }

  constructor() {
    super()
    this.module = 'ingresses'
  }

  getGatewayUrl = params =>
    `kapis/resources.kubesphere.io/v1alpha2${this.getPath(params)}/router`

  @action
  async getGateway(params) {
    this.gateway.isLoading = true

    const url = this.getGatewayUrl(params)
    let data = {}

    try {
      const result = await request.get(url, null, null, () => {})
      if (result) {
        data = ObjectMapper.gateway(result)
      }
    } catch (error) {}

    this.gateway.data = data
    this.gateway.isLoading = false
  }

  @action
  addGateway(params, data) {
    return this.submitting(request.post(this.getGatewayUrl(params), data))
  }

  @action
  updateGateway(params, data) {
    return this.submitting(request.put(this.getGatewayUrl(params), data))
  }

  @action
  deleteGateway(params) {
    return this.submitting(request.delete(this.getGatewayUrl(params)))
  }
}
