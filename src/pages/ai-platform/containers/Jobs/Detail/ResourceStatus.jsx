import React from 'react'
import { observer, inject } from 'mobx-react'

import { Component as Base } from 'projects/containers/Deployments/Detail/ResourceStatus'

@inject('detailStore')
@observer
class JobsResourceStatus extends Base {
  renderContent() {
    return (
      <div>
        {this.renderContainerPorts()}
        {this.renderPods()}
      </div>
    )
  }
}

export default JobsResourceStatus
