import React from 'react'
// import { get } from 'lodash'
import Banner from 'components/Cards/Banner'

// import { getLocalTime } from 'utils'
import { Modal, Table, Row, Col, Button, Card } from 'antd'

import {
  // EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  // UserOutlined,
} from '@ant-design/icons'

import { Button as KButton, Notify } from '@kube-design/components'
import Tree from 'ai-platform/components/Tree'
import { getGroups } from 'api/users'
import { Panel } from 'components/Base'
import GroupStore from 'stores/ai-platform/group'
import { observer } from 'mobx-react'
import Detail from './detail'
import CreateAndEditModal from './form'

import styles from './index.scss'

@observer
export default class GroupsManage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      status: -1,
      item: null,
      show: false,
      isEdit: false,
    }
    this.api = {
      get: getGroups,
    }
    this.store = new GroupStore()
    this.store.getData()
  }

  // async componentDidMount() {
  //   await this.store.getData()
  // }

  getColumns = () => [
    {
      title: '名称',
      dataIndex: 'name',
      width: '10%',
    },
    {
      title: '简称',
      dataIndex: 'desc',
      width: '10%',
    },
    {
      title: '编码',
      dataIndex: 'code',
      width: '15%',
    },
    {
      title: '操作',
      dataIndex: 'more',
      isHideable: true,
      width: '20%',
      render: (_, item) => (
        <div className={styles.btns}>
          <Button
            type="text"
            size="small"
            style={{ color: '#1890ff' }}
            icon={<EditOutlined />}
            onClick={() => this.handleEditItem(item)}
          >
            编辑
          </Button>
          <Button
            type="text"
            size="small"
            style={{ color: '#ff7875' }}
            icon={<DeleteOutlined />}
            onClick={() => this.handleRemove(item)}
          >
            删除
          </Button>
        </div>
      ),
    },
  ]

  selectNode(item) {
    this.setState({
      item,
    })
  }

  handleCreate() {
    this.setState({ isEdit: false, show: true })
  }

  handleEdit() {
    this.setState({ isEdit: true, show: true })
  }

  handleEditItem(item) {
    this.store.setItem(item)
    this.handleEdit()
  }

  handleRemove(item) {
    Modal.confirm({
      title: `确定删除组织${item.name}吗？`,
      icon: <ExclamationCircleOutlined />,
      centered: true,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.store.removeData(item.id).then(res => {
          if (res.code === 200) {
            Notify.success('删除成功')
            this.setState({
              item: null,
            })
            this.getData()
          } else {
            Notify.success('删除失败，请重试')
          }
        })
      },
    })
  }

  render() {
    const { item, show, isEdit } = this.state

    const onCancel = () => {
      this.setState({ show: false })
    }

    // 创建和编辑的回调
    const onSubmit = async res => {
      if (!isEdit) {
        const { code } = await this.store.addData(res)
        code === 200 ? Notify.success('添加成功') : Notify.error('添加失败')
      } else {
        const { code } = await this.store.editData(res)
        code === 200 ? Notify.success('更新成功') : Notify.error('更新失败')
      }
      this.setState({ show: false })
    }

    return (
      <div className={styles.wrapper}>
        <Banner title="组织管理" description={t('INVITE_MEMBER_DESC')} />
        <Row>
          <Col span={6} style={{ paddingRight: '5px' }}>
            <Tree
              canEdit
              store={this.store}
              select={this.selectNode.bind(this)}
              onEdit={() => this.handleEdit()}
            ></Tree>
          </Col>
          <Col span={18} style={{ paddingLeft: '5px' }}>
            <Card>
              {item && (
                <Panel title="选择详情" className="margin-b12">
                  <Detail {...item}></Detail>
                </Panel>
              )}
              <Panel title="子部门列表">
                <Row justify="end" className="margin-b12">
                  <KButton type="control" onClick={() => this.handleCreate()}>
                    创建
                  </KButton>
                </Row>
                <Table
                  border
                  columns={this.getColumns()}
                  dataSource={this.store.childItems}
                  expandable={{
                    // 关闭子节点展开
                    // eslint-disable-next-line no-unused-vars
                    expandIcon: (expanded, onExpand, record) => null,
                  }}
                />
              </Panel>
            </Card>
          </Col>
        </Row>
        <CreateAndEditModal
          show={show}
          isEdit={isEdit}
          onCancel={onCancel}
          onSubmit={onSubmit}
          treeData={this.store.treeData}
          item={this.store.selectedItem}
        ></CreateAndEditModal>
      </div>
    )
  }
}
