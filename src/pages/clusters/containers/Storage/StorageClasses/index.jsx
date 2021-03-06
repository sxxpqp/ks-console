import React from 'react'
import { get, includes } from 'lodash'

import { Notify } from '@kube-design/components'
import { Avatar } from 'components/Base'
import Banner from 'components/Cards/Banner'
import Table from 'components/Tables/List'
import withList, { ListPage } from 'components/HOCs/withList'

import { getDisplayName } from 'utils'
import { ICON_TYPES } from 'utils/constants'

import StorageClassStore from 'stores/storageClass'

@withList({
  store: new StorageClassStore(),
  name: 'Storage Class',
  module: 'storageclasses',
})
export default class StorageClasses extends React.Component {
  validateSelect({ callback }) {
    return (...args) => {
      const { selectedRowKeys, data } = this.list
      const dependent = data.some(
        storageClass =>
          includes(selectedRowKeys, storageClass.name) &&
          storageClass.associationPVCCount
      )

      return dependent ? this.notifyDeleteTips() : callback(...args)
    }
  }

  notifyDeleteTips() {
    Notify.error({ content: `${t('DEPENDENT_STORAGE_CLASS_DELETE_TIPS')}` })
  }

  getColumns = () => {
    const { getSortOrder, prefix } = this.props
    return [
      {
        title: t('Name'),
        key: 'name',
        dataIndex: 'name',
        sorter: true,
        sortOrder: getSortOrder('name'),
        search: true,
        render: (name, record) => (
          <Avatar
            icon={ICON_TYPES[this.module]}
            to={`${prefix}/${name}`}
            title={getDisplayName(record)}
            desc={record.description}
          />
        ),
      },
      {
        title: t('Volume Count'),
        dataIndex: 'volumeCount',
        isHideable: true,
        render: (count, record) =>
          get(record, 'annotations["kubesphere.io/pvc-count"]') || 0,
      },
      {
        title: t('Default'),
        dataIndex: 'default',
        isHideable: true,
        render: value => (value ? t('Yes') : '-'),
      },
      {
        title: t('Support Volume Snapshot'),
        dataIndex: 'supportSnapshot',
        isHideable: true,
        render: supportSnapshot => (supportSnapshot ? t('True') : t('False')),
      },
      {
        title: t('Provisioner'),
        dataIndex: 'provisioner',
        isHideable: true,
      },
    ]
  }

  showCreate = () =>
    this.props.trigger('storageclass.create', {
      name: 'Storage Class',
      module: this.props.module,
      cluster: this.props.match.params.cluster,
    })

  render() {
    const { bannerProps, tableProps } = this.props
    return (
      <ListPage {...this.props}>
        <Banner {...bannerProps} />
        <Table
          {...tableProps}
          columns={this.getColumns()}
          onCreate={this.showCreate}
        />
      </ListPage>
    )
  }
}
