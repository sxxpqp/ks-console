import React, { Component } from 'react'
import { Modal, Table } from 'antd'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { copyToClipboard } from 'utils/dom'
import {
  Notify,
  // Notify
} from '@kube-design/components'
import { CopyOutlined } from '@ant-design/icons'

export default class ImageTagsDetail extends Component {
  render() {
    const { show, name, onCancel } = this.props

    const handleCancel = () => {
      onCancel && onCancel()
    }

    const columns = [
      {
        title: '版本',
        dataIndex: 'tags',
        render: val => (val && val.length ? val[0].name : '-'),
      },
      {
        title: '大小',
        dataIndex: 'size',
        render: val => `${(val / 1024 / 1024).toFixed(2)}MB`,
      },
      {
        title: '创建时间',
        dataIndex: 'push_time',
        render: val => dayjs(val).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '操作',
        render: _ => {
          const link = get(_, 'digest')
          const handleCopy = () => {
            copyToClipboard(
              `docker pull ${globals.config.url.harbor}/${name}@${link}`
            )
            Notify.success({ content: `复制成功` })
          }
          return (
            <>
              <CopyOutlined onClick={handleCopy} />
            </>
          )
        },
      },
    ]

    return (
      <Modal
        title={'镜像详情'}
        centered
        visible={show}
        footer={null}
        width={800}
        // okText="确定"
        // cancelText="取消"
        // onOk={() => this.handleModal(false)}
        onCancel={handleCancel}
        // className={styles.modal}
      >
        <Table key="id" dataSource={this.props.data} columns={columns} />
      </Modal>
    )
  }
}
