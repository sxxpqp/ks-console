import React from 'react'
import { observer, inject } from 'mobx-react'

import { getLocalTime, getDisplayName } from 'utils'
import VolumeStore from 'stores/volume'

import { Avatar, Card, Status } from 'components/Base'
import BaseTable from 'components/Tables/Base'

import styles from './index.scss'

@inject('detailStore')
@observer
export default class Volumes extends React.Component {
  constructor(props) {
    super(props)

    this.volumeStore = props.volumeStore || new VolumeStore()
  }

  get store() {
    return this.props.detailStore
  }

  get storageClassName() {
    return this.store.detail.name
  }

  componentDidMount() {
    this.handleFetch()
  }

  handleFetch = (params = {}) => {
    const { cluster, name } = this.store.detail

    if (params.keyword) {
      params.name = params.keyword
      delete params.keyword
    }

    this.volumeStore.fetchList({
      storageClassName: name,
      cluster,
      ...params,
    })
  }

  getColumns = () => [
    {
      title: t('Name'),
      dataIndex: 'name',
      width: '18%',
      render: (name, record) => (
        <Avatar icon="storage" title={getDisplayName(record)} noLink />
      ),
    },
    {
      title: t('Status'),
      dataIndex: 'phase',
      width: '16%',
      render: phase => (
        <Status type={phase} name={t(`VOLUME_STATUS_${phase.toUpperCase()}`)} />
      ),
    },
    {
      title: t('Capacity'),
      dataIndex: 'capacity',
      width: '16%',
      render: capacity => capacity || '-',
    },
    {
      title: t('Mount Status'),
      dataIndex: 'inUse',
      width: '16%',
      render: inUse => (inUse ? t('Mounted') : t('Not Mounted')),
    },
    {
      title: t('Project'),
      dataIndex: 'namespace',
      key: 'namespace',
      width: '18%',
      customizable: true,
    },
    {
      title: t('Created Time'),
      dataIndex: 'createTime',
      width: '16%',
      render: time => getLocalTime(time).format('YYYY-MM-DD HH:mm:ss'),
    },
  ]

  render() {
    const {
      data,
      filters,
      isLoading,
      total,
      page,
      limit,
    } = this.volumeStore.list
    const pagination = { total, page, limit }

    return (
      <Card
        title={t('Volumes')}
        loading={isLoading}
        empty={t('NOT_AVAILABLE', { resource: t('volumes') })}
      >
        <BaseTable
          className={styles.table}
          data={data}
          columns={this.getColumns()}
          searchType="name"
          keyword={filters.name}
          filters={filters}
          placeholder={t('Search by name')}
          pagination={pagination}
          isLoading={isLoading}
          onFetch={this.handleFetch}
        />
      </Card>
    )
  }
}
