import React from 'react'
import { get, isEmpty } from 'lodash'
import { computed } from 'mobx'
import { inject, observer } from 'mobx-react'
import { Panel, Text } from 'components/Base'

import WorkspaceStore from 'stores/workspace'

import styles from './index.scss'

@inject('detailStore')
@observer
export default class Workspaces extends React.Component {
  store = this.props.detailStore

  workspaceStore = new WorkspaceStore()

  componentDidMount() {
    this.fetchWorkspaces()
  }

  fetchWorkspaces = () => {
    const { detail } = this.store
    const workspaces = get(detail, 'status.workspaces', {})

    this.workspaceStore.fetchList({
      names: Object.keys(workspaces).join(','),
      limit: -1,
    })
  }

  @computed
  get workspaces() {
    return this.workspaceStore.list.data.reduce(
      (prev, cur) => ({
        ...prev,
        [cur.name]: cur,
      }),
      {}
    )
  }

  render() {
    const { detail } = this.store
    const workspacesStatus = get(detail, 'status.workspaces', {})
    const workspaces = this.workspaces

    return (
      <Panel title={t('Workspaces')}>
        <div className={styles.wrapper}>
          {isEmpty(workspacesStatus) && (
            <div className={styles.empty}>
              {t('IPPOOL_WORKSPACE_EMPTY_TIP')}
            </div>
          )}
          {Object.keys(workspacesStatus).map(item => {
            const workspace = workspaces[item] || {}
            return (
              <div key={item} className={styles.item}>
                <Text
                  icon="enterprise"
                  title={item}
                  description={workspace.description || t('Workspace')}
                />
                <Text
                  title={workspacesStatus[item].allocations}
                  description={t('Used IP')}
                />
                <Text title={workspace.manager} description={t('Manager')} />
              </div>
            )
          })}
        </div>
      </Panel>
    )
  }
}
