import Base from './base'

export default class VolumeSnapshotStore extends Base {
  module = 'volumesnapshots'

  get resourceKind() {
    return 'VolumeSnapshot'
  }

  get apiVersion() {
    return 'apis/snapshot.storage.k8s.io/v1beta1'
  }
}
