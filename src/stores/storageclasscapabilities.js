import { action } from 'mobx'
import Base from './base'

export default class StorageClassCapabilityStore extends Base {
  constructor(module = 'storageclasscapabilities') {
    super(module)
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
    if (result) {
      const detail = { ...params, ...this.mapper(result) }

      this.detail = detail
    }

    this.isLoading = false
  }
}
