import React from 'react'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'

import { Table, Pagination } from '@kube-design/components'
import { Card, Indicator } from 'components/Base'
import { getLocalTime } from 'utils'

import styles from './index.scss'

@inject('rootStore', 'detailStore')
@observer
export default class LoginHistory extends React.Component {
  get store() {
    return this.props.detailStore
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = (params = {}) => {
    const { name } = this.store.detail
    this.store.fetchLoginRecords({ name, ...params })
  }

  handlePagination = page => {
    this.fetchData({ page })
  }

  getColumns = () => [
    {
      title: t('Time'),
      dataIndex: 'createTime',
      render: time => getLocalTime(time).format(`YYYY-MM-DD HH:mm:ss`),
    },
    {
      title: t('Status'),
      dataIndex: 'spec.success',
      render: success => (
        <div className={styles.status}>
          <Indicator type={success ? 'success' : 'failed'} />{' '}
          <span>{success ? t('Success') : t('Failed')}</span>
        </div>
      ),
    },
    {
      title: t('Source IP'),
      dataIndex: 'spec.sourceIP',
    },
    {
      title: t('Reason'),
      dataIndex: 'spec.reason',
    },
  ]

  renderContent() {
    const { data } = toJS(this.store.records)

    return (
      <Table
        className={styles.table}
        dataSource={data}
        rowKey="login_time"
        columns={this.getColumns()}
      />
    )
  }

  render() {
    const { page, total, limit } = this.store.records
    return (
      <Card title={t('Login History')} empty={t('No Login History')}>
        {this.renderContent()}
        {total > limit && (
          <div className="margin-t12 text-right">
            <Pagination
              page={page}
              total={total}
              limit={limit}
              onChange={this.handlePagination}
            />
          </div>
        )}
      </Card>
    )
  }
}
