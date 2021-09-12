import React from 'react'

import { Avatar } from 'components/Base'
import Banner from 'components/Cards/Banner'
import Table from 'components/Tables/List'
import withList, { ListPage } from 'components/HOCs/withList'

import { getLocalTime } from 'utils'

import CrdStore from 'stores/crd'

@withList({
  store: new CrdStore(),
  module: 'customresourcedefinitions',
  name: 'Custom Resource Definition',
})
export default class CustomResources extends React.Component {
  getColumns = () => {
    const { cluster } = this.props.match.params
    const { getSortOrder } = this.props
    return [
      {
        title: t('Kind'),
        dataIndex: 'kind',
        render: (kind, record) => (
          <Avatar
            to={`/clusters/${cluster}/customresources/${record.name}`}
            title={kind}
            desc={`${record.group}/${record.latestVersion}`}
          />
        ),
      },
      {
        title: t('Name'),
        key: 'name',
        dataIndex: 'name',
      },
      {
        title: t('Scope'),
        key: 'scope',
        dataIndex: 'scope',
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

  render() {
    const { bannerProps, tableProps } = this.props
    return (
      <ListPage {...this.props} noWatch>
        <Banner {...bannerProps} tabs={this.tabs} />
        <Table
          {...tableProps}
          itemActions={[]}
          columns={this.getColumns()}
          onCreate={null}
          searchType="name"
        />
      </ListPage>
    )
  }
}
