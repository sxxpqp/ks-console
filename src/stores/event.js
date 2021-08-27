import { orderBy } from 'lodash'
import { action, observable } from 'mobx'

import ObjectMapper from 'utils/object.mapper'

export default class EventsStore {
  @observable
  list = {
    data: [],
    page: 1,
    limit: 10,
    total: 0,
    isLoading: true,
  }

  @action
  async fetchList({ name, cluster, namespace, ...rest }) {
    this.list.isLoading = true

    const clusterPath = cluster ? `/klusters/${cluster}` : ''
    const namespacePath = namespace ? `/namespaces/${namespace}` : ''
    const result = await request.get(
      `api/v1${clusterPath}${namespacePath}/events`,
      rest
    )

    this.list = {
      data: orderBy(result.items.map(ObjectMapper.events), 'lastTimestamp'),
      total: result.items.length,
      isLoading: false,
    }
  }
}
