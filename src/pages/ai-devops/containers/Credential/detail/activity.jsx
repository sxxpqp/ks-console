import React from 'react'
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { get } from 'lodash'
import { toJS } from 'mobx'
import PropTypes from 'prop-types'
import { Table } from '@kube-design/components'
import { Card } from 'components/Base'

import styles from './index.scss'

@inject('detailStore')
@observer
class Events extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    loading: PropTypes.bool,
  }

  get cluster() {
    return this.props.match.params.cluster
  }

  get workspace() {
    return this.props.match.params.workspace
  }

  getColumns = () => [
    {
      title: t('name'),
      dataIndex: 'name',
      width: '50%',
    },
    {
      title: t('Record'),
      width: '50%',
      render: record => {
        if (record.ranges) {
          const arr = record.name.split('/')
          const url = `/${this.workspace}/clusters/${this.cluster}/devops/${
            arr[0]
          }/pipelines/${arr[1]}${arr[2] ? `/branch/${arr[2]}` : ''}/activity`
          return (
            <span>
              {record.ranges.ranges.map(range => (
                <Link to={url} key={`${range.start}${range.end}`}>
                  #{range.start}
                  -#
                  {range.end}
                  &nbsp;&nbsp;&nbsp;
                </Link>
              ))}
            </span>
          )
        }
        return '-'
      },
    },
  ]

  render() {
    const { usage, isLoading } = this.props.detailStore
    return (
      <Card title={t('Events')}>
        <Table
          className={styles.table}
          dataSource={toJS(get(usage, 'fingerprint.usage', [])) || []}
          rowKey="name"
          columns={this.getColumns()}
          loading={isLoading}
        />
      </Card>
    )
  }
}

export default Events
