import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Icon, Notify } from '@kube-design/components'
import { Card } from 'components/Base'
import { trigger } from 'utils/action'
import { Modal } from 'antd'
import {
  // EyeOutlined,
  ExclamationCircleOutlined,
  // UserOutlined,
} from '@ant-design/icons'
import { addAppTags, editAppTags, removeAppTags } from 'api/platform'
import CreateAndEditModal from './form'
import Item from './Item'

import styles from './index.scss'

@inject('rootStore')
@observer
@trigger
export default class Cates extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      isEdit: false,
      item: null,
    }
  }

  componentDidMount() {}

  showEdit = (data = {}) => {
    this.setState({
      show: true,
      isEdit: true,
      item: data,
    })
  }

  showAdd = () => {
    this.setState({
      show: true,
      isEdit: false,
      item: null,
    })
  }

  showDelete = data => {
    Modal.confirm({
      title: `确定删除标签${data['name']}吗？`,
      icon: <ExclamationCircleOutlined />,
      centered: true,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        removeAppTags(data.id).then(res => {
          if (res.code === 200) {
            Notify.success('删除成功')
            this.getData()
          } else {
            Notify.success('删除失败，请重试')
          }
        })
        this.props.renew && this.props.renew()
      },
    })
  }

  render() {
    const { selectedId, onSelect, lists } = this.props
    const { show, isEdit, item } = this.state

    let total = 0
    if (lists && lists.length > 0) {
      total = lists.reduce((acc, cur) => {
        return acc + cur.count
      }, 0)
    }

    const onCancel = () => {
      this.setState({ show: false })
    }

    const onSubmit = data => {
      if (isEdit) {
        // 编辑
        editAppTags(data).then(res => {
          // 更新列表
          if (res.code === 200) {
            Notify.success('编辑成功')
          } else {
            Notify.error('编辑失败，请重试')
          }
          this.props.renew && this.props.renew()
        })
      } else {
        // 创建
        addAppTags(data).then(res => {
          // 更新列表
          if (res.code === 200) {
            Notify.success('创建成功')
          } else {
            Notify.error('创建失败，请重试')
          }
          this.props.renew && this.props.renew()
        })
      }
      onCancel()
    }

    return (
      <>
        <Card className={styles.categories}>
          <div className={styles.title}>
            <label>全部标签 ({total})</label>
            <label className={styles.add}>
              <Icon onClick={this.showAdd} name={'add'} size={20} />
            </label>
          </div>
          <ul>
            {lists.map(tag => (
              <Item
                key={tag.tagId}
                data={tag}
                onSelect={onSelect}
                onEdit={this.showEdit}
                onDelete={this.showDelete}
                isSelected={tag.id === selectedId}
              />
            ))}
          </ul>
        </Card>
        <CreateAndEditModal
          show={show}
          isEdit={isEdit}
          onCancel={onCancel}
          onSubmit={onSubmit}
          item={item}
        ></CreateAndEditModal>
      </>
    )
  }
}
