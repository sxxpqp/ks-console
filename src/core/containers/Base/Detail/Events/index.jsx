import React from 'react'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'

import { joinSelector } from 'utils'
import { MODULE_KIND_MAP } from 'utils/constants'
import EventStore from 'stores/event'

import EventsCard from 'components/Cards/Events'

class Events extends React.Component {
  constructor(props) {
    super(props)

    this.eventStore = new EventStore()
  }

  componentDidMount() {
    this.fetchData()
  }

  get store() {
    return this.props.detailStore
  }

  get cluster() {
    return this.props.match.params.cluster
  }

  get module() {
    return this.store.module
  }

  get kind() {
    return MODULE_KIND_MAP[this.module]
  }

  fetchData() {
    const { uid, name, namespace, _originData = {} } = this.store.detail

    const fields = {
      'involvedObject.name': name,
      'involvedObject.namespace': namespace,
      'involvedObject.kind': _originData.kind || this.kind,
      'involvedObject.uid': uid,
    }

    this.eventStore.fetchList({
      namespace,
      cluster: this.cluster,
      fieldSelector: joinSelector(fields),
    })
  }

  render() {
    const { data, isLoading } = toJS(this.eventStore.list)

    return <EventsCard data={data} loading={isLoading} />
  }
}

export default inject('detailStore')(observer(Events))
export const Component = Events
