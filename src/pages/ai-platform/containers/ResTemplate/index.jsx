import React from 'react'
// import { get } from 'lodash'
// import { toJS } from 'mobx'
import Banner from 'components/Cards/Banner'
import { Popover, Table, Row, Col, Input, Form, Button, Modal } from 'antd'

import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'

import { Button as KButton, Notify } from '@kube-design/components'
import { observer } from 'mobx-react'
import ReviewStore from 'stores/ai-platform/review'
import styles from './index.scss'
import CreateAndEditModal from './form'

@observer
export default class Members extends React.Component {
  constructor(props) {
    super(props)
    this.store = new ReviewStore()
    this.store.getTemplates()
    this.state = {
      isEdit: false,
      show: false,
      item: null,
      loading: false,
    }
    this.form = React.createRef()
  }

  getColumns = () => [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '描述',
      dataIndex: 'desc',
      width: '20%',
    },
    // {
    //   title: '推荐应用',
    //   dataIndex: 'app',
    // },
    {
      title: 'CPU',
      dataIndex: 'cpu',
      render: item => `${item} Core`,
    },
    {
      title: '内存',
      dataIndex: 'mem',
      render: item => `${item} GiB`,
    },
    {
      title: '磁盘',
      dataIndex: 'disk',
      render: item => `${item} GB`,
    },
    {
      title: 'GPU',
      dataIndex: 'gpu',
      render: item => `${item} Core`,
    },
    {
      title: '操作',
      dataIndex: 'more',
      // eslint-disable-next-line no-unused-vars
      render: (_, item) => (
        <div className={styles.btns}>
          <Popover content="编辑" title="">
            <Button
              type="text"
              size="small"
              style={{ color: '#1890ff' }}
              icon={<EditOutlined />}
              onClick={() => this.handleEdit(item)}
            >
              编辑
            </Button>
          </Popover>
          <Popover content="删除" title="">
            <Button
              type="text"
              size="small"
              style={{ color: '#ff7875' }}
              icon={<DeleteOutlined />}
              onClick={() => this.handleRemove(item)}
            >
              删除
            </Button>
          </Popover>
        </div>
      ),
    },
  ]

  handleCreate() {
    this.setState({
      isEdit: false,
      show: true,
      item: null,
    })
  }

  handleEdit(item) {
    this.setState({
      isEdit: true,
      show: true,
      item,
    })
  }

  handleRemove(item) {
    Modal.confirm({
      title: `确定删除资源模板${item.name}吗？`,
      icon: <ExclamationCircleOutlined />,
      centered: true,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.store.removeTemplates(item.id).then(res => {
          if (res.code === 200) {
            Notify.success('删除成功')
            this.store.getTemplates()
          } else {
            Notify.success('删除失败，请重试')
          }
        })
      },
    })
  }

  render() {
    const { templates } = this.store
    const { isEdit, show, item, loading } = this.state
    const onCancel = () => {
      this.setState({ show: false })
    }

    // 创建和编辑的回调
    const onSubmit = async res => {
      if (!isEdit) {
        const { code } = await this.store.addTemplates(res)
        code === 200 ? Notify.success('添加成功') : Notify.error('添加失败')
      } else {
        const { code } = await this.store.editTemplates(res)
        code === 200 ? Notify.success('更新成功') : Notify.error('更新失败')
      }
      this.setState({ show: false })
    }

    const handleSearch = () => {
      // this.store.getApplyHisAll()
      const form = this.form.current.getFieldsValue()
      this.store.templateParams = {
        ...this.store.params,
        ...form,
      }
      this.store.getTemplates()
    }

    const handleReset = () => {
      this.setState({
        loading: true,
      })
      this.form.current.resetFields()
      // this.store.getApplyHisAll()
      this.store.templateParams = {
        ...this.store.templateParams,
        pageSize: 10,
        current: 1,
        total: 0,
        name: '',
      }
      this.store.getTemplates().finally(() => {
        this.setState({
          loading: false,
        })
      })
    }

    return (
      <>
        <Banner
          title="资源模板管理"
          description="用户申请资源时，推荐的应用资源模板管理"
        />
        <div className="table-title">
          <Form ref={this.form}>
            <Row justify="space-between" align="middle">
              <Row justify="space-around" gutter={15}>
                <Col>
                  <Form.Item label="名称" name="name">
                    <Input />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item>
                    <KButton type="control" onClick={handleSearch}>
                      搜索
                    </KButton>
                    <KButton type="default" onClick={handleReset}>
                      清空
                    </KButton>
                  </Form.Item>
                </Col>
              </Row>
              <Col>
                <Form.Item>
                  <KButton type="control" onClick={() => this.handleCreate()}>
                    创建
                  </KButton>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <Table
          key="id"
          loading={loading}
          columns={this.getColumns()}
          dataSource={templates}
        />
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
