import React from 'react'
import { inject } from 'mobx-react'

import VersionList from 'apps/components/Lists/VersionList'

@inject('detailStore', 'versionStore', 'workspaceStore')
export default class VersionManage extends React.Component {
  render() {
    const { detailStore, versionStore, workspaceStore, match } = this.props

    return (
      <VersionList
        appStore={detailStore}
        versionStore={versionStore}
        clusters={workspaceStore.clusters.data}
        match={match}
      />
    )
  }
}
