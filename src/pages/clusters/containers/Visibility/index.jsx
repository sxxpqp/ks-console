import React from 'react'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import { Button } from '@kube-design/components'
import { Avatar, Panel, Text } from 'components/Base'
import Table from 'components/Tables/Base'
import Banner from 'components/Cards/Banner'
import { getLocalTime, getDisplayName } from 'utils'
import { trigger } from 'utils/action'

import WorkspaceStore from 'stores/workspace'

import styles from './index.scss'

@inject('rootStore', 'clusterStore')
@observer
@trigger
export default class Overview extends React.Component {
  workspaceStore = new WorkspaceStore()

  componentDidMount() {
    this.getData()
  }

  get cluster() {
    return this.props.clusterStore
  }

  get isClusterPublicVisible() {
    return this.cluster.detail.visibility === 'public'
  }

  get enabledActions() {
    return globals.app.getActions({
      module: 'cluster-settings',
      cluster: this.props.match.params.cluster,
    })
  }

  get tips() {
    return [
      {
        title: t('CLUSTER_VISIBILITY_Q1'),
        description: t('CLUSTER_VISIBILITY_A1'),
      },
      {
        title: t('CLUSTER_VISIBILITY_Q2'),
        description: t('CLUSTER_VISIBILITY_A2'),
      },
    ]
  }

  getData = params => {
    this.workspaceStore.fetchList({
      ...this.props.match.params,
      ...params,
      labelSelector: 'kubefed.io/managed=true',
    })
  }

  afterEdit = async () => {
    const { cluster } = this.props.match.params
    await this.cluster.fetchDetail({ name: cluster })

    this.getData()
  }

  getColumns() {
    return [
      {
        title: t('Workspace'),
        dataIndex: 'name',
        render: (name, record) => (
          <Avatar
            icon="enterprise"
            iconSize={40}
            title={getDisplayName(record)}
            desc={record.description || '-'}
            noLink
          />
        ),
      },
      {
        title: t('Manager'),
        dataIndex: 'manager',
      },
      {
        title: t('Created Time'),
        dataIndex: 'createTime',
        width: '20%',
        render: time => getLocalTime(time).format('YYYY-MM-DD HH:mm:ss'),
      },
    ]
  }

  editVisibility = () =>
    this.trigger('cluster.visibility.edit', {
      store: this.cluster,
      cluster: this.cluster.detail,
      success: this.afterEdit,
    })

  renderVisibility() {
    const {
      data,
      total,
      page,
      limit,
      filters,
      keyword,
      isLoading,
    } = this.workspaceStore.list

    const pagination = { total, page, limit }

    const emptyProps = {
      name: 'Workspace',
      module: 'workspaces',
      desc: t('CLUSTER_AUTHORIZATION_DESC'),
    }

    return (
      <div className={styles.tableWrapper}>
        <Table
          data={toJS(data)}
          filters={filters}
          keyword={keyword}
          pagination={pagination}
          isLoading={isLoading}
          onFetch={this.getData}
          searchType="name"
          emptyProps={emptyProps}
          columns={this.getColumns()}
        />
      </div>
    )
  }

  render() {
    return (
      <>
        <Banner
          icon="cluster"
          title={t('Cluster Visibility')}
          description={t('CLUSTER_AUTHORIZATION_DESC')}
          tips={this.tips}
        />
        <Panel>
          <div className={styles.header}>
            <Text
              icon={this.isClusterPublicVisible ? 'eye' : 'eye-closed'}
              title={
                this.isClusterPublicVisible
                  ? t('VISIBILITY_PUBLIC')
                  : t('VISIBILITY_PART')
              }
              description={t('Cluster Visibility')}
            />
            {globals.app.isMultiCluster &&
              this.enabledActions.includes('edit') && (
                <Button onClick={this.editVisibility}>
                  {t('Edit Visibility')}
                </Button>
              )}
          </div>
          {this.renderVisibility()}
        </Panel>
      </>
    )
  }
}
