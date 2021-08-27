import { observable } from 'mobx'
import { to } from 'utils'
import VolumeSnapshotStore from 'stores/volumeSnapshot'

import Base from './base'

export default class VolumeStore extends Base {
  get resourceKind() {
    return 'PersistentVolumeClaim'
  }

  @observable
  mountedPods = {
    data: [],
    isLoading: true,
  }

  module = 'persistentvolumeclaims'

  async fetchVolumeMountStatus() {
    const { name, namespace } = this.detail

    const result = await to(
      request.get(this.getResourceUrl({ namespace }), {
        name,
      })
    )

    const volumes = result.items || []

    const volume = volumes.find(vol => this.mapper(vol).name === name) || {}

    this.detail.inUse = this.mapper(volume).inUse
  }

  async cloneVolume({ name }) {
    const {
      cluster,
      namespace,
      name: sourceName,
      accessModes,
      capacity,
      storageClassName,
    } = this.detail

    const params = {
      apiVersion: 'v1',
      kind: this.resourceKind,
      metadata: {
        name,
      },
      spec: {
        accessModes,
        resources: {
          requests: {
            storage: capacity,
          },
        },
        dataSource: {
          kind: this.resourceKind,
          name: sourceName,
        },
        storageClassName,
      },
    }

    const path = this.getListUrl({ cluster, namespace })

    await this.submitting(request.post(path, params))
  }

  /**
   * create snapshot from detail
   */
  async createSnapshot({ name }) {
    const snapshotstore = new VolumeSnapshotStore()
    const {
      cluster,
      namespace,
      name: sourceName,
      storageClassName,
    } = this.detail

    const path = snapshotstore.getListUrl({ cluster, namespace })

    const params = {
      apiVersion: 'snapshot.storage.k8s.io/v1beta1',
      kind: snapshotstore.resourceKind,
      metadata: {
        name,
      },
      spec: {
        volumeSnapshotClassName: storageClassName,
        source: {
          kind: this.resourceKind,
          persistentVolumeClaimName: sourceName,
        },
      },
    }

    await this.submitting(request.post(path, params))
  }
}
