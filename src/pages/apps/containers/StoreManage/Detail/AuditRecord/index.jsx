import React from 'react'

import Table from 'components/Tables/List'
import withList, { ListPage } from 'components/HOCs/withList'
import VersionStatus from 'apps/components/VersionStatus'

import AuditStore from 'stores/openpitrix/audit'
import { getLocalTime } from 'utils'

import styles from './index.scss'

@withList({
  store: new AuditStore(),
  module: 'apps',
  name: 'Audits',
  rowKey: 'status_time',
})
export default class AuditRecord extends React.Component {
  getData = params => {
    const { appId } = this.props.match.params
    this.props.store.fetchList({ app_id: appId, ...params })
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
      title: t('Time'),
      dataIndex: 'status_time',
      width: '20%',
      render: time => getLocalTime(time).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      isHideable: true,
      width: '15%',
      render: status => <VersionStatus type={status} name={status} />,
    },
    {
      title: t('Version'),
      dataIndex: 'version_name',
      isHideable: true,
      width: '15%',
    },
    {
      title: t('Rejection Reason'),
      key: 'reject',
      isHideable: true,
      width: '40%',
      render: (reviewId, item) => item.message || '-',
    },
    {
      title: t('Operator'),
      dataIndex: 'operator',
      isHideable: true,
      width: '10%',
    },
  ]

  render() {
    const { tableProps } = this.props
    return (
      <ListPage {...this.props} getData={this.getData} noWatch>
        <div className={styles.title}>{t('Audit Records')}</div>
        <Table
          {...tableProps}
          tableActions={this.tableActions}
          itemActions={[]}
          columns={this.getColumns()}
          hideSearch
        />
      </ListPage>
    )
  }
}
