import { get, set, isString, isEmpty, isArray } from 'lodash'
import { action, observable } from 'mobx'
import ObjectMapper from 'utils/object.mapper'
import VolumeSnapshotClasses from 'stores/volumeSnapshotClasses'
import Base from './base'

export default class StorageClassStore extends Base {
  @observable
  resources = {
    data: [],
    isLoading: true,
  }

  @observable
  metrics = {
    data: [],
    isLoading: true,
  }

  module = 'storageclasses'

  getResourceUrl = params =>
    `kapis/resources.kubesphere.io/v1alpha3${this.getPath(params)}/${
      this.module
    }`

  async delete(params) {
    await super.delete(params)
    const volumeSnapshotClassStore = new VolumeSnapshotClasses()
    await volumeSnapshotClassStore.deleteSilent(params)
  }

  async batchDelete(rowKeys) {
    await super.batchDelete(rowKeys)
    const volumeSnapshotClassStore = new VolumeSnapshotClasses()
    volumeSnapshotClassStore.silentBatchDelete(rowKeys)
  }

  @action
  create(data, params) {
    if (data.provisioner === 'custom') {
      data.provisioner = data.parameters.provisioner
      delete data.parameters.provisioner
    }

    if (isString(data.allowVolumeExpansion)) {
      data.allowVolumeExpansion = data.allowVolumeExpansion === 'true'
    }

    const supportedAccessModes = get(
      data,
      'metadata.annotations["storageclass.kubesphere.io/supported-access-modes"]'
    )

    if (!isEmpty(supportedAccessModes) && isArray(supportedAccessModes)) {
      set(
        data,
        'metadata.annotations["storageclass.kubesphere.io/supported-access-modes"]',
        JSON.stringify(supportedAccessModes)
      )
    }

    return this.submitting(request.post(this.getListUrl(params), data))
  }

  async createAlongWithSnapshotClasses(data, params) {
    await this.create(data, params)
    const volumeSnapshotClassStore = new VolumeSnapshotClasses()

    if (
      get(
        data,
        'metadata.annotations["storageclass.kubesphere.io/support-snapshot"]'
      ) === 'true'
    ) {
      await volumeSnapshotClassStore.create(
        {
          metadata: {
            name: get(data, 'metadata.name'),
          },
          driver: get(data, 'provisioner'),
        },
        params
      )
    }
  }

  @action
  async fetchResources({ name, ...rest }) {
    this.resources.isLoading = true

    const params = {
      ...rest,
    }

    if (name) {
      params.conditions = `storageClassName=${name}`
    }

    const result = await request.get(
      `kapis/resources.kubesphere.io/v1alpha2/persistentvolumeclaims`,
      params
    )

    this.resources = {
      data: result.items ? result.items.map(ObjectMapper.volumes) : [],
      isLoading: false,
    }
  }

  getStorageSizeConfig() {
    const DEFAULT_MAX_SIZE = 2048
    const DEFAULT_STEP = 1
    const DEFAULT_MIN_SIZE = 0

    const detail = this.detail || {}
    const min = Number(get(detail, 'parameters.minSize')) || DEFAULT_MIN_SIZE
    const max = Number(get(detail, 'parameters.maxSize')) || DEFAULT_MAX_SIZE
    const step = Number(get(detail, 'parameters.stepSize')) || DEFAULT_STEP

    return { min, max, step }
  }
}
