import React from 'react'
import { get } from 'lodash'
import { toJS } from 'mobx'
import { Avatar, Status } from 'components/Base'
import Banner from 'components/Cards/Banner'
import { withProjectList, ListPage } from 'components/HOCs/withList'
import Table from 'components/Tables/List'

import { getLocalTime } from 'utils'

import UserStore from 'stores/user'
import RoleStore from 'stores/role'

@withProjectList({
  store: new UserStore(),
  module: 'users',
  authKey: 'members',
  name: 'Project Member',
  rowKey: 'username',
})
export default class Members extends React.Component {
  roleStore = new RoleStore()

  get canViewRoles() {
    return globals.app.hasPermission({
      ...this.props.match.params,
      project: this.props.match.params.namespace,
      module: 'roles',
      action: 'view',
    })
  }

  componentDidMount() {
    this.canViewRoles &&
      this.roleStore.fetchList({ ...this.props.match.params, limit: -1 })
  }

  get tips() {
    return [
      {
        title: t('HOW_TO_INVITE_MEMBER_Q'),
        description: t('HOW_TO_INVITE_MEMBER_A'),
      },
    ]
  }

  showAction(record) {
    return globals.user.username !== record.name
  }

  get itemActions() {
    const { getData, trigger } = this.props
    return [
      {
        key: 'modify',
        icon: 'pen',
        text: t('Modify Member Role'),
        action: 'edit',
        show: this.showAction,
        onClick: item =>
          trigger('member.edit', {
            detail: item,
            ...this.props.match.params,
            roles: toJS(this.roleStore.list.data),
            role: item.role,
            success: getData,
          }),
      },
      {
        key: 'delete',
        icon: 'trash',
        text: t('Remove Member'),
        action: 'delete',
        show: this.showAction,
        onClick: item =>
          trigger('member.remove', {
            detail: item,
            success: getData,
            ...this.props.match.params,
          }),
      },
    ]
  }

  get tableActions() {
    const { routing, getData, trigger, tableProps } = this.props
    return {
      ...tableProps.tableActions,
      actions: [
        {
          key: 'invite',
          type: 'control',
          text: t('Invite Member'),
          action: 'create',
          onClick: () =>
            trigger('member.invite', {
              ...this.props.match.params,
              roles: toJS(this.roleStore.list.data),
              roleModule: this.roleStore.module,
              workspace: get(this.props, 'projectStore.detail.workspace'),
              title: t('Invite Members to the Project'),
              desc: t('INVITE_MEMBER_DESC'),
              searchPlaceholder: t('INVITE_MEMBER_SEARCH_PLACEHODLER'),
              success: routing.query,
            }),
        },
      ],
      selectActions: [
        {
          key: 'delete',
          type: 'danger',
          text: t('Remove Members'),
          action: 'delete',
          onClick: () =>
            trigger('member.remove.batch', {
              success: getData,
              ...this.props.match.params,
            }),
        },
      ],
      getCheckboxProps: record => ({
        disabled: !this.showAction(record),
        name: record.name,
      }),
      emptyProps: {
        desc: t('INVITE_MEMBER_DESC'),
      },
    }
  }

  getColumns = () => [
    {
      title: t('Member Name'),
      dataIndex: 'username',
      sorter: true,
      render: (name, record) => (
        <Avatar
          avatar={record.avatar_url || '/assets/default-user.svg'}
          title={name}
          desc={record.email || '-'}
          noLink
        />
      ),
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      isHideable: true,
      width: '19%',
      render: status => (
        <Status type={status} name={t(`USER_${status.toUpperCase()}`)} />
      ),
    },
    {
      title: t('Role'),
      dataIndex: 'role',
      isHideable: true,
      width: '19%',
    },
    {
      title: t('Last Login Time'),
      dataIndex: 'lastLoginTime',
      isHideable: true,
      width: 150,
      render: login_time => (
        <p>
          {login_time
            ? getLocalTime(login_time).format('YYYY-MM-DD HH:mm:ss')
            : t('Not logged in yet')}
        </p>
      ),
    },
  ]

  render() {
    const { bannerProps, tableProps } = this.props
    return (
      <ListPage {...this.props} noWatch>
        <Banner
          {...bannerProps}
          tabs={this.tabs}
          description={t('INVITE_MEMBER_DESC')}
        />
        <Table
          {...tableProps}
          searchType="name"
          tableActions={this.tableActions}
          itemActions={this.itemActions}
          columns={this.getColumns()}
        />
      </ListPage>
    )
  }
}
