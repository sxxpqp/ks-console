import { inject, observer } from 'mobx-react'
import { joinSelector } from 'utils'
import { Component as Base } from 'core/containers/Base/Detail/Events'

@inject('detailStore')
@observer
export default class Events extends Base {
  fetchData() {
    const { name } = this.store.detail

    const fields = {
      'involvedObject.name': name,
      'involvedObject.kind': this.kind,
    }

    this.eventStore.fetchList({
      cluster: this.cluster,
      fieldSelector: joinSelector(fields),
    })
  }
}
