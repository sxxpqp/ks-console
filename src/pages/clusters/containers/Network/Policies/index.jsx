import React from 'react'
import { get } from 'lodash'
import { Link } from 'react-router-dom'
import { Avatar } from 'components/Base'
import Banner from 'components/Cards/Banner'
import NetworkPolicyStore from 'stores/network/policy'
import { withClusterList, ListPage } from 'components/HOCs/withList'
import ResourceTable from 'clusters/components/ResourceTable'

import { getLocalTime, getDisplayName } from 'utils'
import { ICON_TYPES } from 'utils/constants'

@withClusterList({
  store: new NetworkPolicyStore('networkpolicies'),
  name: 'Network Policy',
  module: 'networkpolicies',
  rowKey: 'key',
})
export default class NetworkPolicies extends React.Component {
  tips = [
    {
      title: t('NETWORK_POLICY_Q'),
      description: t('NETWORK_POLICY_A'),
    },
    {
      title: t('NETWORK_POLICY_Q1'),
      description: t.html('NETWORK_POLICY_A1'),
    },
  ]

  constructor(props) {
    super(props)
    this.store = props.store
  }

  get params() {
    return get(this.props.match, 'params', {})
  }

  get cluster() {
    return get(this.params, 'cluster')
  }

  get itemActions() {
    const { trigger, routing, name } = this.props
    return [
      {
        key: 'edit',
        icon: 'pen',
        text: t('Edit'),
        action: 'edit',
        onClick: item =>
          trigger('resource.baseinfo.edit', {
            detail: item,
            success: routing.query,
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
            success: routing.query,
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
            success: routing.query,
          }),
      },
    ]
  }

  get actions() {
    const { trigger, routing } = this.props
    const { cluster } = this
    return [
      {
        key: 'create',
        type: 'control',
        text: t('Create Network Policy'),
        action: 'create',
        onClick: () =>
          trigger('network.policies.addByYaml', {
            ...this.props,
            cluster,
            success: routing.query,
          }),
      },
    ]
  }

  get getColumns() {
    const { getSortOrder, module } = this.props
    const { cluster } = this.props.match.params
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
            desc={record.description}
            to={`/clusters/${cluster}/projects/${record.namespace}/${module}/${name}`}
          />
        ),
      },
      {
        title: t('Project'),
        dataIndex: 'namespace',
        isHideable: true,
        width: '22%',
        render: namespace => (
          <Link to={`/clusters/${cluster}/projects/${namespace}`}>
            {namespace}
          </Link>
        ),
      },
      {
        title: t('Create Time'),
        dataIndex: 'createTime',
        sorter: true,
        sortOrder: getSortOrder('createTime'),
        isHideable: true,
        width: 150,
        render: time => getLocalTime(time).format('YYYY-MM-DD HH:mm:ss'),
      },
    ]
  }

  render() {
    const { tips } = this
    const { query, match, bannerProps, tableProps } = this.props
    return (
      <ListPage {...this.props}>
        <Banner {...bannerProps} tips={tips} />
        <ResourceTable
          {...tableProps}
          rowKey="key"
          itemActions={this.itemActions}
          namespace={query.namespace}
          columns={this.getColumns}
          actions={this.actions}
          cluster={match.params.cluster}
          searchType="name"
        />
      </ListPage>
    )
  }
}
