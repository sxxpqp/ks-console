import React from 'react'
// import { toJS } from 'mobx'
// import { Avatar } from 'components/Base'
import Banner from 'components/Cards/Banner'
// import { withProjectList, ListPage } from 'components/HOCs/withList'
// import Table from 'components/Tables/List'
import { Modal, Table, Row, Col, Input, Form, Button } from 'antd'
import { Button as KButton, Notify } from '@kube-design/components'
// import { getLocalTime } from 'utils'
// import { ICON_TYPES } from 'utils/constants'

// import RoleStore from 'stores/role'
import { getRoles, addRole, editRole, removeRole } from 'api/users'
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import styles from './index.scss'
// @withProjectList({
//   store: new RoleStore(),
//   module: 'roles',
//   name: 'Project Role',
// })
export default class Roles extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      params: {
        current: 1,
        pageSize: 10,
        name: '',
        desc: '',
        total: 0,
      },
      loading: true,
      isEdit: false,
      show: false,
      item: {},
    }
    this.getData()
    this.formRef = React.createRef()
    this.searchFormRef = React.createRef()
  }

  async getData(params = '') {
    const res = await getRoles(params || this.state.params)
    if (res.code === 200) {
      this.setState({
        data: res.data,
        loading: false,
        params: { ...this.state.params, total: res.total },
      })
    }
  }

  componentDidMount() {
    // this.getData()
  }

  getColumns = () => [
    {
      title: '角色名称',
      dataIndex: 'desc',
      width: '10%',
    },
    {
      title: '角色编码',
      dataIndex: 'role_name',
      width: '10%',
    },
    {
      title: '操作',
      dataIndex: 'more',
      isHideable: true,
      width: '20%',
      // eslint-disable-next-line no-unused-vars
      render: (_, item) => (
        <div className={styles.btns}>
          <Button
            type="text"
            size="small"
            style={{ color: '#096dd9' }}
            icon={<EditOutlined />}
            onClick={() => this.handleEdit(item)}
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

  handleSearch() {
    const params = this.searchFormRef.current.getFieldsValue()
    this.getData({
      current: 1,
      pageSize: 10,
      role_name: params.role_name || '',
      desc: params.desc || '',
    })
  }

  handleReset() {
    this.searchFormRef.current.resetFields()
    this.setState({
      params: {
        current: 1,
        pageSize: 10,
        desc: '',
        role_name: '',
        total: 0,
      },
    })
    this.getData({
      current: 1,
      pageSize: 10,
    })
  }

  // 创建角色
  handleCreate() {
    this.setState({
      item: { desc: '', role_name: '' },
      isEdit: false,
      show: true,
    })
    // this.formRef.current.resetFields()
  }

  // 编辑角色
  handleEdit(item) {
    this.setState({ isEdit: true, show: true, item })
    setTimeout(() => {
      this.formRef.current.setFieldsValue({
        desc: item.desc,
        role_name: item.role_name,
      })
    }, 0)
  }

  // 删除角色
  handleRemove(item) {
    Modal.confirm({
      title: `确定删除角色${item.desc}吗？`,
      icon: <ExclamationCircleOutlined />,
      centered: true,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        removeRole(item.id).then(res => {
          if (res.code === 200) {
            Notify.success('删除成功')
            this.getData()
          } else {
            Notify.success('删除失败，请重试')
          }
        })
      },
    })
  }

  handleModal(show) {
    this.setState({ show })
  }

  renderModal() {
    const { isEdit, show, item } = this.state

    const onCancel = () => {
      this.formRef.current.resetFields()
      this.handleModal(false)
    }

    const onSubmit = () => {
      this.formRef.current.validateFields().then(values => {
        if (!isEdit) {
          addRole(values).then(async res => {
            if (res.code === 200) {
              await this.getData()
              Notify.success('编辑成功')
            } else {
              Notify.error(res.message)
            }
          })
        } else {
          editRole({
            id: item.id,
            ...values,
          }).then(async res => {
            if (res.code === 200) {
              await this.getData()
              Notify.success('编辑成功')
            } else {
              Notify.error(res.message)
            }
          })
        }
        onCancel()
      })
    }

    return (
      <Modal
        title={isEdit ? '编辑角色' : '创建角色'}
        centered
        visible={show}
        footer={null}
        // okText="确定"
        // cancelText="取消"
        // onOk={() => this.handleModal(false)}
        onCancel={onCancel}
      >
        <Form
          name="form"
          ref={this.formRef}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          // initialValues={{ remember: true }}
          // onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          // initialValues={item}
          autoComplete="off"
          className="margin-b12"
        >
          <Form.Item
            label="角色名称"
            name="desc"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="角色编码"
            name="role_name"
            rules={[{ required: true, message: '请输入角色编码' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Row justify="end">
              <KButton type="control" onClick={onSubmit}>
                确定
              </KButton>
              <KButton type="default" htmlType="button" onClick={onCancel}>
                取消
              </KButton>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
    )
  }

  render() {
    const { data, loading, pagination } = this.state
    return (
      <div>
        <Banner title="角色管理" description={t('PROJECT_ROLE_DESC')} />
        <div className="table-title">
          <Form name="search" ref={this.searchFormRef}>
            <Row justify="space-between" align="middle">
              <Row justify="space-around" gutter={15}>
                <Col>
                  <Form.Item label="角色名" name="desc">
                    <Input />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item label="角色编码" name="role_name">
                    <Input />
                  </Form.Item>
                </Col>
                <Col>
                  <KButton type="control" onClick={() => this.handleSearch()}>
                    搜索
                  </KButton>
                  <KButton type="default" onClick={() => this.handleReset()}>
                    清空
                  </KButton>
                </Col>
              </Row>
              <Col>
                <Form.Item>
                  <KButton
                    type="control"
                    onClick={this.handleCreate.bind(this)}
                  >
                    新增
                  </KButton>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <Table
          loading={loading}
          columns={this.getColumns()}
          dataSource={data}
          pagination={pagination}
        />
        {this.renderModal()}
      </div>
    )
  }
}
