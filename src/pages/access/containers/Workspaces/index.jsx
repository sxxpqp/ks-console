import React from 'react'
import { computed } from 'mobx'

import { Avatar } from 'components/Base'
import Banner from 'components/Cards/Banner'
import withList, { ListPage } from 'components/HOCs/withList'
import Table from 'components/Tables/List'
import ClusterWrapper from 'components/Clusters/ClusterWrapper'

import { getLocalTime, getDisplayName } from 'utils'

import WorkspaceStore from 'stores/workspace'
import ClusterStore from 'stores/cluster'

@withList({
  store: new WorkspaceStore(),
  module: 'workspaces',
  name: 'Workspace',
})
export default class Workspaces extends React.Component {
  clusterStore = new ClusterStore()

  componentDidMount() {
    this.clusterStore.fetchList({ limit: -1 })
  }

  @computed
  get clusters() {
    return this.clusterStore.list.data
  }

  showAction(record) {
    return globals.config.systemWorkspace !== record.name
  }

  get itemActions() {
    const { name, routing, trigger } = this.props
    return [
      {
        key: 'edit',
        icon: 'pen',
        text: t('Edit'),
        action: 'edit',
        show: this.showAction,
        onClick: item =>
          trigger('resource.baseinfo.edit', {
            detail: item,
            success: routing.query,
          }),
      },
      {
        key: 'delete',
        icon: 'trash',
        text: t('Delete'),
        action: 'delete',
        show: this.showAction,
        onClick: item =>
          trigger('resource.delete', {
            type: t(name),
            resource: item.name,
            detail: item,
            success: routing.query,
          }),
      },
    ]
  }

  get tableActions() {
    const { tableProps } = this.props
    return {
      ...tableProps.tableActions,
      getCheckboxProps: record => ({
        disabled: !this.showAction(record),
        name: record.name,
      }),
    }
  }

  getColumns = () => {
    const { getSortOrder } = this.props

    const columns = [
      {
        title: t('Name'),
        dataIndex: 'name',
        sorter: true,
        sortOrder: getSortOrder('name'),
        render: (name, record) => (
          <Avatar
            icon="enterprise"
            iconSize={40}
            title={getDisplayName(record)}
            desc={record.description || 'Workspaces'}
            to={`/workspaces/${name}`}
          />
        ),
      },
      {
        title: t('Created Time'),
        dataIndex: 'createTime',
        sorter: true,
        sortOrder: getSortOrder('createTime'),
        isHideable: true,
        width: 250,
        render: time => getLocalTime(time).format('YYYY-MM-DD HH:mm:ss'),
      },
    ]

    if (globals.app.isMultiCluster) {
      columns.splice(1, 0, {
        title: t('Cluster Info'),
        dataIndex: 'clusters',
        width: '30%',
        render: clusters => (
          <ClusterWrapper clusters={clusters} clustersDetail={this.clusters} />
        ),
      })
    }

    return columns
  }

  showCreate = () => {
    const { getData } = this.props
    return this.props.trigger('workspace.create', {
      success: getData,
    })
  }

  render() {
    const { bannerProps, tableProps } = this.props
    const isClusterLoading = this.clusterStore.list.isLoading
    return (
      <ListPage {...this.props} noWatch>
        <Banner {...bannerProps} />
        <Table
          {...tableProps}
          columns={this.getColumns()}
          itemActions={this.itemActions}
          tableActions={this.tableActions}
          onCreate={this.showCreate}
          isLoading={tableProps.isLoading || isClusterLoading}
          searchType="name"
        />
      </ListPage>
    )
  }
}
