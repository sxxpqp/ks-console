import React from 'react'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'

import { Table } from '@kube-design/components'
import { Panel, Status } from 'components/Base'
import { getLocalTime } from 'utils'

import styles from './index.scss'

@inject('detailStore')
@observer
export default class Events extends React.Component {
  constructor(props) {
    super(props)

    this.store = props.detailStore
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData() {
    this.store.fetchEvents({
      ...this.props.match.params,
    })
  }

  getColumns = () => [
    {
      title: t('Created Time'),
      dataIndex: 'create_time',
      width: '24%',
      render: create_time =>
        getLocalTime(create_time).format(`YYYY-MM-DD HH:mm:ss`),
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      width: '16%',
      render: status => <Status type={status} name={t(status)} />,
    },
    {
      title: t('Message'),
      dataIndex: 'result',
      render: result => result || '-',
    },
  ]

  render() {
    const { data, isLoading } = this.store.events

    return (
      <Panel title={t('Events')}>
        <Table
          className={styles.table}
          dataSource={toJS(data)}
          columns={this.getColumns()}
          loading={isLoading}
          rowKey={'create_time'}
        />
      </Panel>
    )
  }
}
