import { action, observable } from 'mobx'

import { to } from 'utils'
import ObjectMapper from 'utils/object.mapper'

export default class ResourceStore {
  @observable
  isExistService = false

  @observable
  service = {}

  @observable
  isLoading = true

  getPath({ cluster, namespace } = {}) {
    let path = ''
    if (cluster) {
      path += `/klusters/${cluster}`
    }
    if (namespace) {
      path += `/namespaces/${namespace}`
    }
    return path
  }

  getServiceUrl = ({ name, cluster, namespace }) =>
    `api/v${this.getPath({ cluster, namespace })}/services/${name}`

  @action
  async checkService({ name, cluster, namespace }) {
    if (!name || !namespace) {
      return
    }

    const result = await request.get(
      this.getServiceUrl({ name, cluster, namespace }),
      {},
      {
        headers: { 'x-check-exist': true },
      }
    )

    this.isExistService = result.exist
  }

  @action
  async fetchService({ name, cluster, namespace }) {
    this.isLoading = true

    const result = await to(
      request.get(this.getServiceUrl({ name, cluster, namespace }))
    )

    this.service = ObjectMapper.services(result)
    this.isLoading = false
  }
}
