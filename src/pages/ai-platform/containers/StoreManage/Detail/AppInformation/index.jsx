import React from 'react'
import { observer, inject } from 'mobx-react'
import { toJS } from 'mobx'
import { get } from 'lodash'

import { Panel } from 'components/Base'
import AppInfo from 'apps/components/AppInfo'

@inject('detailStore', 'versionStore')
@observer
export default class AppInformation extends React.Component {
  componentDidMount() {
    const appId = get(this.props.match, 'params.appId', '')
    const versions = get(this.props.versionStore, 'list.data', [])

    if (versions.length === 0) {
      this.props.versionStore.fetchList({
        app_id: appId,
      })
    }
  }

  render() {
    const app = get(this.props.detailStore, 'detail', {})
    const versions = get(this.props.versionStore, 'list.data', [])

    return (
      <Panel title={t('App Information')}>
        <AppInfo app={app} versions={toJS(versions)} />
      </Panel>
    )
  }
}
