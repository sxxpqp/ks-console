import React from 'react'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import { joinSelector } from 'utils'
import EventStore from 'stores/event'

import EventsCard from 'components/Cards/Events'

class Events extends React.Component {
  constructor(props) {
    super(props)

    this.eventStore = new EventStore()
    this.fetchData()
  }

  get store() {
    return this.props.s2iRunStore
  }

  get namespace() {
    return this.store.jobDetail.namespace
  }

  fetchData = () => {
    const { uid, name, namespace } = this.store.jobDetail
    const { cluster } = this.props.match.params
    const fields = {
      'involvedObject.name': name,
      'involvedObject.namespace': namespace,
      'involvedObject.kind': 'Job',
      'involvedObject.uid': uid,
    }

    this.eventStore.fetchList({
      cluster,
      namespace: this.namespace,
      fieldSelector: joinSelector(fields),
    })
  }

  render() {
    const { data, isLoading } = toJS(this.eventStore.list)

    return <EventsCard data={data} loading={isLoading} />
  }
}

export default inject('s2iRunStore')(observer(Events))
export const Component = Events
