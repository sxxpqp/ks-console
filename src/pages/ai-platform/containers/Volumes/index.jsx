/*
 * This file is part of KubeSphere Console.
 * Copyright (C) 2019 The KubeSphere Console Authors.
 *
 * KubeSphere Console is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * KubeSphere Console is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 *
 * along with KubeSphere Console.  If not, see <https://www.gnu.org/licenses/>.
 */

import React from 'react'
import { isEmpty } from 'lodash'
import { withProjectList, ListPage } from 'components/HOCs/withList'
import Table from 'components/Tables/List'
import VolumeStore from 'stores/volume'
import { getLocalTime, getDisplayName } from 'utils'
import { getVolumeStatus } from 'utils/status'
import { VOLUME_STATUS } from 'utils/constants'
import StatusReason from 'projects/components/StatusReason'

import { Avatar, Status } from 'components/Base'

import Banner from 'components/Cards/Banner'
import { Button as KButton } from '@kube-design/components'
import {
  // Popover,
  Form,
  Row,
  Col,
  Input,
  Radio,
} from 'antd'

import styles from './index.scss'

@withProjectList({
  store: new VolumeStore(),
  module: 'persistentvolumeclaims',
  authKey: 'volumes',
  name: 'Volume',
  rowKey: 'uid',
})
export default class Volumes extends React.Component {
  constructor(props) {
    super(props)
    this.form = React.createRef()
    this.table = React.createRef()
  }

  get itemActions() {
    const { trigger, name } = this.props

    return [
      {
        key: 'edit',
        icon: 'pen',
        text: t('Edit'),
        action: 'edit',
        onClick: item =>
          trigger('resource.baseinfo.edit', {
            detail: item,
          }),
      },
      {
        key: 'editYaml',
        icon: 'pen',
        text: t('Edit YAML'),
        action: 'edit',
        onClick: item =>
          trigger('resource.yaml.edit', {
            detail: item,
          }),
      },
      {
        key: 'delete',
        icon: 'trash',
        text: t('Delete'),
        action: 'delete',
        onClick: item =>
          trigger('resource.delete', {
            type: t(name),
            detail: item,
          }),
      },
    ]
  }

  getItemDesc = record => {
    const status = getVolumeStatus(record)
    const desc = !isEmpty(status) ? (
      <StatusReason reason={status} data={record} type={'volume'} />
    ) : (
      record.storageClassName || '-'
    )

    return desc
  }

  getStatus() {
    return VOLUME_STATUS.map(status => ({
      text: t(status.text),
      value: status.value,
    }))
  }

  getColumns() {
    const { getSortOrder, getFilteredValue } = this.props

    return [
      {
        title: t('Name'),
        dataIndex: 'name',
        sortOrder: getSortOrder('name'),
        search: true,
        sorter: true,
        render: (name, record) => (
          <Avatar
            icon={'storage'}
            iconSize={40}
            to={`${this.props.match.url}/${name}`}
            desc={this.getItemDesc(record)}
            title={getDisplayName(record)}
          />
        ),
      },
      {
        title: t('Status'),
        dataIndex: 'status',
        isHideable: true,
        search: true,
        filters: this.getStatus(),
        filteredValue: getFilteredValue('status'),
        width: '14%',
        render: (_, { phase }) => (
          <Status
            type={phase}
            className={styles.status}
            name={t(`VOLUME_STATUS_${phase.toUpperCase()}`)}
            flicker
          />
        ),
      },
      {
        title: t('Access Mode'),
        dataIndex: 'capacity',
        isHideable: true,
        width: '16%',
        render: (capacity, { accessMode }) => (
          <div className={styles.capacity}>
            <p>{accessMode}</p>
          </div>
        ),
      },
      {
        title: t('Mount'),
        dataIndex: 'inUse',
        isHideable: true,
        width: '14%',
        render: inUse => (inUse ? t('Mounted') : t('Not Mounted')),
      },
      {
        title: t('Created Time'),
        dataIndex: 'createTime',
        sorter: true,
        sortOrder: getSortOrder('createTime'),
        isHideable: true,
        width: 150,
        render: time => getLocalTime(time).format('YYYY-MM-DD HH:mm'),
      },
    ]
  }

  showCreate = () => {
    const { match, module, projectStore } = this.props
    return this.props.trigger('volume.create', {
      module,
      projectDetail: projectStore.detail,
      namespace: match.params.namespace,
      cluster: match.params.cluster,
    })
  }

  renderCustomFilter() {
    const onReset = () => {
      this.table && this.table.clearFilter()
    }
    const onSearch = () => {
      const values = this.form.current.getFieldsValue()
      this.table && this.table.handleOutSearch(values)
    }
    const radioChange = val => {
      const values = this.form.current.getFieldsValue()
      this.table && this.table.handleOutSearch({ ...values, status: val })
    }

    return (
      <Form ref={this.form}>
        <Row justify="space-between" align="middle" className="margin-b12">
          <Row justify="space-between" gutter={15}>
            <Col>
              <Form.Item label="状态" name="status">
                <Radio.Group
                  defaultValue={''}
                  onChange={e => radioChange(e.target.value)}
                >
                  <Radio value={''}>全部</Radio>
                  <Radio value={'bound'}>准备就绪</Radio>
                  <Radio value={'lost'}>丢失</Radio>
                  <Radio value={'pending'}>等待中</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                label="名称"
                name="name"
                style={{ width: '280px', marginRight: '10px' }}
              >
                <Input placeholder="请输入名称" />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>
                <KButton type="control" onClick={onSearch}>
                  搜索
                </KButton>
                <KButton type="default" onClick={onReset}>
                  清空
                </KButton>
              </Form.Item>
            </Col>
          </Row>
          <Col>
            <Form.Item>
              <KButton type="control" onClick={this.showCreate}>
                创建
              </KButton>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    )
  }

  render() {
    const { query, match, bannerProps, tableProps } = this.props
    return (
      <ListPage {...this.props}>
        <Banner {...bannerProps} tips={this.tips} />
        <Table
          onRef={node => {
            this.table = node
          }}
          {...tableProps}
          hideSearch
          customFilter={this.renderCustomFilter()}
          itemActions={this.itemActions}
          namespace={query.namespace}
          columns={this.getColumns()}
          onCreate={this.showCreate}
          cluster={match.params.cluster}
          formRef={this.form}
        />
      </ListPage>
    )
  }
}
