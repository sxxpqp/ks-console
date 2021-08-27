import React from 'react'
import { toJS } from 'mobx'

import { Avatar } from 'components/Base'
import Banner from 'components/Cards/Banner'
import Table from 'components/Tables/List'
import withList, { ListPage } from 'components/HOCs/withList'

import { getLocalTime } from 'utils'
import { ICON_TYPES } from 'utils/constants'

import RoleStore from 'stores/role'

@withList({
  store: new RoleStore('globalroles'),
  module: 'globalroles',
  authKey: 'roles',
  name: 'Account Role',
})
export default class Roles extends React.Component {
  componentDidMount() {
    this.props.store.fetchRoleTemplates(this.props.match.params)
  }

  showAction = record => !globals.config.presetGlobalRoles.includes(record.name)

  get itemActions() {
    const { trigger, store, name, module, routing } = this.props
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
        key: 'editRole',
        icon: 'pen',
        text: t('Edit Authorization'),
        action: 'edit',
        show: this.showAction,
        onClick: item =>
          trigger('role.edit', {
            module,
            detail: item,
            roleTemplates: toJS(store.roleTemplates.data),
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
          trigger('role.delete', {
            detail: item,
            type: t(name),
            success: routing.query,
          }),
      },
    ]
  }

  get tableActions() {
    const { tableProps } = this.props
    return {
      ...tableProps.tableActions,
      onCreate: this.showCreate,
      selectActions: [],
    }
  }

  getColumns = () => {
    const { getSortOrder, module } = this.props
    return [
      {
        title: t('Name'),
        dataIndex: 'name',
        width: '25%',
        render: (name, record) => (
          <Avatar
            icon={ICON_TYPES[module]}
            to={`/access/roles/${name}`}
            title={name}
            desc={record.aliasName}
          />
        ),
      },
      {
        title: t('Description'),
        key: 'description',
        dataIndex: 'description',
        isHideable: true,
        width: '55%',
      },
      {
        title: t('Created Time'),
        dataIndex: 'createTime',
        sorter: true,
        sortOrder: getSortOrder('createTime'),
        isHideable: true,
        width: '19%',
        render: time => getLocalTime(time).format('YYYY-MM-DD HH:mm:ss'),
      },
    ]
  }

  showCreate = () => {
    const { store, trigger, getData } = this.props
    return trigger('role.create', {
      title: t('Create Account Role'),
      roleTemplates: toJS(store.roleTemplates.data),
      success: getData,
    })
  }

  render() {
    const { bannerProps, tableProps } = this.props
    return (
      <ListPage {...this.props} noWatch>
        <Banner {...bannerProps} tabs={this.tabs} title={t('Account Roles')} />
        <Table
          {...tableProps}
          tableActions={this.tableActions}
          itemActions={this.itemActions}
          columns={this.getColumns()}
          searchType="name"
        />
      </ListPage>
    )
  }
}
