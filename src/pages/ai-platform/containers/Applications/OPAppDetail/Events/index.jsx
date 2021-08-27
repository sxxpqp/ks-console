import { joinSelector } from 'utils'
import { Component as Base } from 'core/containers/Base/Detail/Events'

export default class Events extends Base {
  fetchData() {
    const { name, namespace } = this.store.detail

    this.eventStore.fetchList({
      namespace,
      fieldSelector: joinSelector({
        'involvedObject.name': name,
        'involvedObject.kind': 'Deployment',
      }),
    })
  }
}
