import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { computed } from 'mobx'

import MetircQueryInput from 'components/Modals/CustomMonitoring/components/MetircQueryInput'

@observer
export default class CustomRule extends Component {
  componentDidMount() {
    const { cluster, namespace } = this.props
    this.props.store.fetchMetadata({ cluster, namespace })
  }

  @computed
  get supportMetrics() {
    return this.props.store.targetsMetadata.map(metadata => ({
      value: metadata.metric,
      desc: metadata.help,
      type: metadata.type,
    }))
  }

  render() {
    return (
      <MetircQueryInput {...this.props} supportMetrics={this.supportMetrics} />
    )
  }
}
