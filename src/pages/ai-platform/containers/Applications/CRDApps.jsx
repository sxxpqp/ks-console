import React from 'react'
import { get } from 'lodash'

import { Status } from 'components/Base'
import Avatar from 'apps/components/Avatar'
import { withProjectList, ListPage } from 'components/HOCs/withList'
import Table from 'components/Tables/List'

import { getLocalTime, getDisplayName } from 'utils'

import CRDAppStore from 'stores/application/crd'
import Banner from './Banner'

@withProjectList({
  store: new CRDAppStore(),
  module: 'applications',
  name: 'Application',
})
export default class CRDApps extends React.Component {
  type = 'composing'

  get canCreate() {
    const { workspace, cluster, namespace: project } = this.props.match.params
    const canCreateDeployment = globals.app
      .getActions({
        workspace,
        cluster,
        project,
        module: 'deployments',
      })
      .includes('create')

    const canCreateService = globals.app
      .getActions({
        workspace,
        cluster,
        project,
        module: 'services',
      })
      .includes('create')

    return canCreateDeployment && canCreateService
  }

  getColumns = () => {
    const { getSortOrder } = this.props
    return [
      {
        title: t('Name'),
        dataIndex: 'name',
        sorter: true,
        sortOrder: getSortOrder('name'),
        search: true,
        render: (name, record) => (
          <Avatar
            title={getDisplayName(record)}
            avatar={record.icon || '/assets/default-app.svg'}
            to={`${this.props.match.url}/${name}`}
            desc={get(record, 'annotations["kubesphere.io/description"]', '-')}
          />
        ),
      },
      {
        title: t('Status'),
        dataIndex: 'status',
        isHideable: true,
        width: '20%',
        render: status => <Status name={t(status)} type={status} flicker />,
      },
      {
        title: t('Version'),
        dataIndex: 'version',
        isHideable: true,
        width: '20%',
      },
      {
        title: t('Created Time'),
        dataIndex: 'createTime',
        sorter: true,
        sortOrder: getSortOrder('createTime'),
        isHideable: true,
        width: 180,
        render: time => getLocalTime(time).format('YYYY-MM-DD HH:mm:ss'),
      },
    ]
  }

  showCreate = () => {
    const { match, module, projectStore, getData } = this.props
    return this.props.trigger('crd.app.create', {
      module,
      ...match.params,
      projectDetail: projectStore.detail,
      success: getData,
    })
  }

  getTableProps() {
    const { tableProps } = this.props
    const actions = this.canCreate
      ? [
          {
            key: 'create',
            type: 'control',
            text: t('Create Composing Application'),
            onClick: this.showCreate,
          },
        ]
      : []
    return {
      tableActions: {
        ...tableProps.tableActions,
        actions,
        onCreate: null,
      },
      emptyProps: {
        title: t('Composing Apps'),
        desc: t('COMPOSING_APP_DESC'),
      },
      searchType: 'name',
    }
  }

  render() {
    const { bannerProps, tableProps, match } = this.props
    return (
      <ListPage {...this.props}>
        <Banner
          {...bannerProps}
          match={match}
          title="自制应用"
          description={t('APP_TEMPLATES_DESC')}
          type={this.type}
        />
        <Table
          {...tableProps}
          {...this.getTableProps()}
          columns={this.getColumns()}
        />
      </ListPage>
    )
  }
}
