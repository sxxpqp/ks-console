import React from 'react'
import { Link } from 'react-router-dom'
import { Avatar } from 'components/Base'
import { withProjectList, ListPage } from 'components/HOCs/withList'
import Banner from 'components/Cards/Banner'
import Table from 'components/Tables/List'

import { getDisplayName, getLocalTime } from 'utils'
import { ICON_TYPES } from 'utils/constants'

import ServiceAccountStore from 'stores/serviceAccount'

@withProjectList({
  store: new ServiceAccountStore(),
  module: 'serviceaccounts',
  name: 'ServiceAccount',
})
export default class ServiceAccounts extends React.Component {
  get prefix() {
    const { cluster, workspace, namespace } = this.props.match.params
    return `${
      workspace ? `/${workspace}` : ''
    }/clusters/${cluster}/projects/${namespace}`
  }

  get itemActions() {
    const { trigger, name } = this.props
    return [
      {
        key: 'edit',
        icon: 'pen',
        text: t('Edit'),
        action: 'edit',
        onClick: item =>
          trigger('serviceaccount.edit', {
            detail: item,
            ...this.props.match.params,
          }),
      },
      {
        key: 'editYaml',
        icon: 'pen',
        text: t('Edit YAML'),
        action: 'edit',
        onClick: item =>
          trigger('resource.yaml.edit', {
            detail: item,
          }),
      },
      {
        key: 'modify',
        icon: 'pen',
        text: t('Modify Service Account Role'),
        action: 'edit',
        onClick: item =>
          trigger('serviceaccount.role.edit', {
            detail: item,
            ...this.props.match.params,
          }),
      },
      {
        key: 'delete',
        icon: 'trash',
        text: t('Delete'),
        action: 'delete',
        onClick: item =>
          trigger('resource.delete', {
            type: t(name),
            detail: item,
          }),
      },
    ]
  }

  getColumns = () => {
    const { getSortOrder, module } = this.props
    return [
      {
        title: t('Name'),
        dataIndex: 'name',
        sorter: true,
        sortOrder: getSortOrder('name'),
        render: (name, record) => (
          <Avatar
            icon={ICON_TYPES[module]}
            iconSize={40}
            title={getDisplayName(record)}
            desc={record.description || '-'}
            to={`${this.props.match.url}/${name}`}
            isMultiCluster={record.isFedManaged}
          />
        ),
      },
      {
        title: t('Role'),
        dataIndex: 'role',
        isHideable: true,
      },
      {
        title: t('Secret'),
        dataIndex: 'secrets',
        isHideable: true,
        render: secrets =>
          secrets.map(item => (
            <div>
              <Link to={`${this.prefix}/secrets/${item.name}`}>
                {item.name}
              </Link>
            </div>
          )),
      },
      {
        title: t('Created Time'),
        dataIndex: 'createTime',
        sorter: true,
        sortOrder: getSortOrder('createTime'),
        isHideable: true,
        width: 150,
        render: time => getLocalTime(time).format('YYYY-MM-DD HH:mm:ss'),
      },
    ]
  }

  showCreate = () => {
    const { match, module, projectStore } = this.props
    return this.props.trigger('serviceaccount.create', {
      module,
      projectDetail: projectStore.detail,
      namespace: match.params.namespace,
      cluster: match.params.cluster,
    })
  }

  render() {
    const { bannerProps, tableProps } = this.props
    return (
      <ListPage {...this.props}>
        <Banner {...bannerProps} />
        <Table
          {...tableProps}
          columns={this.getColumns()}
          itemActions={this.itemActions}
          onCreate={this.showCreate}
          searchType="name"
        />
      </ListPage>
    )
  }
}
