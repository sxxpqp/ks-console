import React from 'react'
import { get } from 'lodash'
import { toJS, computed } from 'mobx'
import { inject, observer } from 'mobx-react'
import { Button, InputSearch, Columns, Column } from '@kube-design/components'
import { Modal, ScrollLoad } from 'components/Base'
import WorkspaceStore from 'stores/workspace'
import ClusterStore from 'stores/cluster'

import WorkspaceCard from './Card'
import styles from './index.scss'

@inject('rootStore')
@observer
export default class WorkspaceSelectModal extends React.Component {
  constructor(props) {
    super(props)
    this.store = new WorkspaceStore()
    this.clusterStore = new ClusterStore()
  }

  componentDidMount() {
    this.clusterStore.fetchList({ limit: -1 })
  }

  @computed
  get clusters() {
    return this.clusterStore.list.data
  }

  fetchData = params => {
    this.store.fetchList({ ...params })
  }

  handleSearch = name => {
    this.fetchData({ name })
  }

  handleRefresh = () => {
    this.fetchData()
  }

  handleOnEnter = workspace => {
    const { onChange } = this.props
    localStorage.setItem(`${globals.user.username}-workspace`, workspace)
    onChange && onChange(workspace)
  }

  showCreate = () => {
    this.props.rootStore.triggerAction('workspace.create', {
      store: this.store,
      success: this.fetchData,
    })
  }

  render() {
    const { visible, onCancel } = this.props
    const { data, total, page, isLoading } = toJS(this.store.list)

    const keyword = get(this.store.list, 'filters.name')

    const canCreate = globals.app
      .getActions({ module: 'workspaces' })
      .includes('manage')

    return (
      <Modal
        bodyClassName={styles.body}
        visible={visible}
        onCancel={onCancel}
        width={960}
        icon="enterprise"
        title={t('Workspace')}
        description={t('WORKSPACE_DESC')}
        hideFooter
      >
        <div className={styles.bar}>
          <Columns>
            <Column>
              <InputSearch
                value={keyword}
                placeholder={t('Search by name')}
                onSearch={this.handleSearch}
              />
            </Column>
            <Column className="is-narrow">
              <div>
                <Button
                  icon="refresh"
                  type="flat"
                  onClick={this.handleRefresh}
                />
                {canCreate && (
                  <Button type="control" onClick={this.showCreate}>
                    {t('Create Workspace')}
                  </Button>
                )}
              </div>
            </Column>
          </Columns>
        </div>
        <div className={styles.list}>
          <ScrollLoad
            wrapperClassName={styles.listWrapper}
            data={toJS(data)}
            total={total}
            page={page}
            loading={isLoading}
            onFetch={this.fetchData}
          >
            {data.map(item => (
              <WorkspaceCard
                key={item.uid}
                data={item}
                clustersDetail={this.clusters}
                onEnter={this.handleOnEnter}
              />
            ))}
          </ScrollLoad>
        </div>
      </Modal>
    )
  }
}
