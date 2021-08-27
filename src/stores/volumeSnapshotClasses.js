import { action } from 'mobx'
import Base from './base'

export default class VolumeSnapshotClassStore extends Base {
  module = 'volumesnapshotclasses'

  get resourceKind() {
    return 'VolumeSnapshotClass'
  }

  get apiVersion() {
    return 'apis/snapshot.storage.k8s.io/v1beta1'
  }

  create(params, options) {
    return super.create(
      {
        apiVersion: 'snapshot.storage.k8s.io/v1beta1',
        kind: this.resourceKind,
        deletionPolicy: 'Delete',
        ...params,
      },
      options
    )
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

  async deleteSilent(params) {
    await request.delete(this.getDetailUrl(params), {}, {}, () => {})
  }

  async silentBatchDelete(keys) {
    return Promise.all(
      keys.map(name =>
        request.delete(this.getDetailUrl({ name }), {}, {}, () => {})
      )
    )
  }
}
