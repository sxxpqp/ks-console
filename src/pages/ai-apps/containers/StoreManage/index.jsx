import React from 'react'
import { capitalize } from 'lodash'

import Table from 'components/Tables/List'
import withList, { ListPage } from 'components/HOCs/withList'
import { Status } from 'components/Base'
import Banner from 'components/Cards/Banner'
import Avatar from 'apps/components/Avatar'
import { getLocalTime } from 'utils'

import { getAppCategoryNames, transferAppStatus } from 'utils/app'
import AppStore from 'stores/openpitrix/store'

@withList({
  store: new AppStore(),
  module: 'apps',
  name: 'Apps',
  rowKey: 'app_id',
})
export default class Store extends React.Component {
  get itemActions() {
    return []
  }

  get tableActions() {
    const { tableProps } = this.props
    return {
      ...tableProps.tableActions,
      onCreate: null,
      selectActions: [],
    }
  }

  getColumns = () => [
    {
      title: t('Name'),
      dataIndex: 'name',
      width: '30%',
      render: (name, app) => (
        <Avatar
          to={`/apps-manage/store/${app.app_id}`}
          avatar={app.icon}
          iconLetter={name}
          iconSize={40}
          title={name}
          desc={app.description}
        />
      ),
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      isHideable: true,
      width: '10%',
      render: status => (
        <Status type={status} name={t(capitalize(transferAppStatus(status)))} />
      ),
    },
    {
      title: t('Workspace'),
      dataIndex: 'isv',
      isHideable: true,
      width: '10%',
    },
    {
      title: t('Latest Version'),
      dataIndex: 'latest_app_version.name',
      isHideable: true,
      width: '16%',
    },
    {
      title: t('App Category'),
      dataIndex: 'category_set',
      isHideable: true,
      width: '17%',
      render: categories => getAppCategoryNames(categories),
    },
    {
      title: t('Release / Suspended Time'),
      dataIndex: 'status_time',
      isHideable: true,
      width: '17%',
      render: time => getLocalTime(time).fromNow(),
    },
  ]

  render() {
    const { bannerProps, tableProps } = this.props
    return (
      <ListPage {...this.props} noWatch>
        <Banner
          {...bannerProps}
          title={t('App Store')}
          description={t('APP_STORE_DESC')}
        />
        <Table
          {...tableProps}
          tableActions={this.tableActions}
          itemActions={this.itemActions}
          columns={this.getColumns()}
          searchType="keyword"
        />
      </ListPage>
    )
  }
}
