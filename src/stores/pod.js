import { action } from 'mobx'
import { isEmpty } from 'lodash'
import { getWorkloadVolumes } from 'utils/workload'
import Base from './base'

export default class PodStore extends Base {
  module = 'pods'

  @action
  async fetchDetail({ cluster, namespace, name, silent }) {
    if (!silent) {
      this.isLoading = true
    }

    const result = await request.get(
      this.getDetailUrl({ cluster, namespace, name })
    )
    const detail = this.mapper(result)

    detail.cluster = cluster
    detail.volumes = await getWorkloadVolumes(detail)

    if (!isEmpty(detail.volumes)) {
      detail.containers.forEach(container => {
        if (!isEmpty(container.volumeMounts)) {
          container.volumeMounts.forEach(volumeMount => {
            const volume = detail.volumes.find(
              _volume => _volume.name === volumeMount.name
            )
            if (!isEmpty(volume)) {
              volume.containers = volume.containers || []
              volume.containers.push(container)
            }
          })
        }
      })
    }

    this.detail = detail

    if (!silent) {
      this.isLoading = false
    }

    return detail
  }
}
