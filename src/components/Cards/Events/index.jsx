import React from 'react'
import PropTypes from 'prop-types'

import { Table } from '@kube-design/components'
import { Panel, Status } from 'components/Base'

import styles from './index.scss'

class Events extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    loading: PropTypes.bool,
  }

  getColumns = () => [
    {
      title: t('Type'),
      dataIndex: 'type',
      width: '10%',
      render: type => (
        <Status type={type} name={t(`EVENT_${type.toUpperCase()}`)} />
      ),
    },
    {
      title: t('Reason'),
      dataIndex: 'reason',
      width: '16%',
    },
    {
      title: t('EVENT_AGE'),
      dataIndex: 'age',
      width: '16%',
    },
    {
      title: t('EVENT_FROM'),
      dataIndex: 'from',
      width: '18%',
    },
    {
      title: t('Message'),
      dataIndex: 'message',
    },
  ]

  render() {
    const { data, loading } = this.props

    return (
      <Panel title={t('Events')}>
        <Table
          className={styles.table}
          dataSource={data}
          columns={this.getColumns()}
          loading={loading}
        />
      </Panel>
    )
  }
}

export default Events
