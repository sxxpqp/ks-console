import React from 'react'
import { toJS, reaction } from 'mobx'
import { observer, inject } from 'mobx-react'

import { getLocalTime } from 'utils'

import {
  Button,
  Columns,
  Column,
  Level,
  LevelLeft,
  LevelRight,
  Table,
  InputSearch,
  Pagination,
} from '@kube-design/components'
import { Card, Status } from 'components/Base'

import styles from './index.scss'

@inject('rootStore', 'detailStore', 'recordStore')
@observer
class ExcuteRecords extends React.Component {
  get store() {
    return this.props.detailStore
  }

  get recordStore() {
    return this.props.recordStore
  }

  get excute() {
    return toJS(this.recordStore.excute)
  }

  constructor(props) {
    super(props)

    this.fetchData()
    this.disposer = reaction(
      () => this.store.detail,
      () => this.fetchData()
    )
  }

  componentWillUnmount() {
    this.disposer && this.disposer()
  }

  fetchData = params => {
    if (this.recordStore) {
      this.recordStore.fetchExcuteRecords({
        ...params,
        ...this.props.match.params,
      })
    }
  }

  getColumns = () => [
    {
      title: t('No.'),
      dataIndex: 'id',
      width: '7%',
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      width: '19%',
      render: (status, record) => (
        <Status
          type={status}
          name={t(status)}
          ready={record.succeed}
          total={record.desire}
        />
      ),
    },
    {
      title: t('Message'),
      dataIndex: 'messages[0]',
      render: msg => msg || '-',
    },
    {
      title: t('Start Time'),
      dataIndex: 'start-time',
      render: time => getLocalTime(time).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: t('End Time'),
      dataIndex: 'completion-time',
      render: time =>
        !time || /^0001-01-01/.test(time)
          ? '-'
          : getLocalTime(time).format('YYYY-MM-DD HH:mm:ss'),
    },
  ]

  handleSearch = value => {
    this.fetchData(value)
  }

  handlePagination = page => {
    this.fetchData({ page })
  }

  handleRefresh = () => {
    this.fetchData()
  }

  renderTableTitle = () => (
    <div className={styles.nav}>
      <Columns>
        <Column>
          <InputSearch
            name="search"
            placeholder={t('Filter by keyword')}
            onSearch={this.handleSearch}
          />
        </Column>
      </Columns>
    </div>
  )

  renderTableFooter = () => {
    const { total, page, limit } = this.excute

    return (
      <Level>
        <LevelLeft>{t('TOTAL_ITEMS', { num: total })}</LevelLeft>
        <LevelRight>
          <Pagination
            page={page}
            total={total}
            limit={limit}
            onChange={this.handlePagination}
          />
        </LevelRight>
      </Level>
    )
  }

  renderTable() {
    const { data, isLoading } = this.excute

    return (
      <Table
        className={styles.table}
        dataSource={data}
        columns={this.getColumns()}
        loading={isLoading}
      />
    )
  }

  render() {
    return (
      <Card
        className={styles.main}
        title={t('Execution Records')}
        operations={
          <Button icon="refresh" type="flat" onClick={this.handleRefresh} />
        }
      >
        <div className={styles.content}>{this.renderTable()}</div>
      </Card>
    )
  }
}

export default ExcuteRecords
