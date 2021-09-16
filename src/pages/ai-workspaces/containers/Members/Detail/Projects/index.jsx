import React from 'react'
import { toJS, computed } from 'mobx'
import { observer, inject } from 'mobx-react'
import { getLocalTime, getDisplayName } from 'utils'

import Table from 'workspaces/components/ResourceTable'
import { Card } from 'components/Base'

import ProjectStore from 'stores/project'

import styles from './index.scss'

@inject('detailStore', 'workspaceStore')
@observer
export default class MemberProjects extends React.Component {
  projectStore = new ProjectStore()

  componentDidMount() {
    this.workspaceStore
      .fetchClusters({
        workspace: this.workspace,
        limit: -1,
      })
      .then(() => {
        this.getData()
      })
  }

  @computed
  get clusters() {
    return this.workspaceStore.clusters.data.map(item => ({
      label: item.name,
      value: item.name,
      disabled: !item.isReady,
      cluster: item,
    }))
  }

  get workspaceStore() {
    return this.props.workspaceStore
  }

  get workspace() {
    return this.props.match.params.workspace
  }

  getColumns = () => [
    {
      title: t('Name'),
      dataIndex: 'name',
      width: '33%',
      render: (name, record) => getDisplayName(record),
    },
    {
      title: t('Created Time'),
      dataIndex: 'createTime',
      width: '33%',
      render: createTime => (
        <p>{getLocalTime(createTime).format('YYYY-MM-DD HH:mm:ss')}</p>
      ),
    },
  ]

  get clusterProps() {
    return {
      clusters: this.clusters,
      cluster: this.workspaceStore.cluster,
      onClusterChange: this.handleClusterChange,
      showClusterSelect: globals.app.isMultiCluster,
    }
  }

  getData = (params = {}) => {
    this.projectStore.fetchListByUser({
      workspace: this.workspace,
      cluster: this.workspaceStore.cluster,
      username: this.props.detailStore.detail.name,
      ...params,
    })
  }

  handleClusterChange = cluster => {
    this.workspaceStore.selectCluster(cluster)
    this.getData()
  }

  render() {
    const { data, page, limit, total, isLoading } = toJS(this.projectStore.list)
    const pagination = { page, limit, total }

    return (
      <Card title={t('Projects')}>
        <Table
          className={styles.table}
          data={data}
          columns={this.getColumns()}
          isLoading={isLoading || this.workspaceStore.clusters.isLoading}
          onFetch={this.getData}
          pagination={pagination}
          {...this.clusterProps}
          name="Projects"
          hideSearch
          hideCustom
        />
      </Card>
    )
  }
}
