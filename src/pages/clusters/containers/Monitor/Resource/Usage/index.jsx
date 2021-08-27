import React from 'react'
import { inject } from 'mobx-react'

import PhysicalResource from './Physical'
import VirtualResource from './Virtual'
import ProjectTrend from './Trend'

@inject('rootStore')
class ResourceUsage extends React.Component {
  renderPhysicalResource() {
    return <PhysicalResource {...this.props} />
  }

  renderVirtualResource() {
    return <VirtualResource {...this.props} />
  }

  renderProjectTrend() {
    return <ProjectTrend {...this.props} />
  }

  render() {
    return (
      <div>
        {this.renderPhysicalResource()}
        {this.renderVirtualResource()}
        {this.renderProjectTrend()}
      </div>
    )
  }
}

export default ResourceUsage
