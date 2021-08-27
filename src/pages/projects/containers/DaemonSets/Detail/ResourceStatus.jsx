import { observer, inject } from 'mobx-react'

import { Component as ResourceBase } from 'projects/containers/Deployments/Detail/ResourceStatus'

@inject('detailStore')
@observer
class DaemonSetsResourceStatus extends ResourceBase {
  get enableScaleReplica() {
    return null
  }
}

export default DaemonSetsResourceStatus
