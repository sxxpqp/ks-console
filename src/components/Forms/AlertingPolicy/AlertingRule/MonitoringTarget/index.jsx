import React from 'react'

import WorkloadSelect from './WorkloadSelect'
import NodeSelect from './NodeSelect'

export default class MonitoringTarget extends React.Component {
  render() {
    const { namespace } = this.props

    return namespace ? (
      <WorkloadSelect {...this.props} />
    ) : (
      <NodeSelect {...this.props} />
    )
  }
}
