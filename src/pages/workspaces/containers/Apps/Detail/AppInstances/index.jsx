import React from 'react'
import { inject } from 'mobx-react'

import InstanceList from 'apps/components/Lists/InstanceList'

@inject('workspaceStore')
export default class AppInstances extends React.Component {
  render() {
    const { workspaceStore } = this.props
    const { appId, workspace } = this.props.match.params
    return (
      <InstanceList
        appId={appId}
        workspace={workspace}
        clusters={workspaceStore.clusters.data}
      />
    )
  }
}
