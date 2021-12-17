import React from 'react'
import { get } from 'lodash'
// import { toJS } from 'mobx'
import Banner from 'components/Cards/Banner'
// import { withProjectList } from 'components/HOCs/withList'
// import Table from 'components/Tables/List'

import { getLocalTime } from 'utils'
import {
  Tag,
  Popover,
  Table,
  Row,
  Col,
  Input,
  Form,
  Button,
  Radio,
  Modal,
} from 'antd'
import Tree from 'ai-platform/components/Tree'
// import UserStore from 'stores/user'
// import RoleStore from 'stores/role'
import GroupStore from 'stores/ai-platform/group'
import RoleStore from 'stores/ai-platform/roles'
import {
  // EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  // UserOutlined,
} from '@ant-design/icons'

import { getUsers, removeUser, addUser, editUser } from 'api/users'
import { Button as KButton, Notify } from '@kube-design/components'
import styles from './index.scss'
import CreateAndEditModal from './form'

// @withProjectList({
//   store: new UserStore(),
//   module: 'users',
//   authKey: 'members',
//   name: 'Project Member',
//   rowKey: 'username',
// })
export default class Members extends React.Component {
  constructor(props) {
    super(props)
    this.roleStore = new RoleStore()
    this.roleStore.getData()
    this.groupStore = new GroupStore()
    this.groupStore.getData()
    this.state = {
      data: [],
      item: null,
      show: false,
      isEdit: false,
      params: {
        gid: '',
        status: '',
        name: '',
        username: '',
      },
      user: null,
    }
    this.form = React.createRef()
  }

  // get canViewRoles() {
  //   return globals.app.hasPermission({
  //     ...this.props.match.params,
  //     project: this.props.match.params.namespace,
  //     module: 'roles',
  //     action: 'view',
  //   })
  // }

  componentDidMount() {
    this.getData()
  }

  handleEdit(item) {
    this.setState({ isEdit: true, show: true, user: item })
  }

  handleRemove(item) {
    Modal.confirm({
      title: `确定删除成员${item.name}吗？`,
      icon: <ExclamationCircleOutlined />,
      centered: true,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        removeUser(item.id).then(res => {
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

  getData(newParams) {
    getUsers(newParams).then(res => {
      if (res.code === 200) {
        this.setState({
          data: res.data,
        })
      }
    })
  }

  getColumns = () => [
    {
      title: '用户名称',
      dataIndex: 'name',
    },
    {
      title: '登录账号',
      dataIndex: 'username',
    },
    {
      title: t('Role'),
      dataIndex: 'users_roles',
      render: val => {
        const names = val.map(i => get(i, 'role.desc'))
        return names.map(i => <Tag color="orange">{i}</Tag>)
      },
    },
    {
      title: '上级部门',
      dataIndex: 'users_groups',
      render: val => {
        let groups = []
        groups = val.map(i => (i.group && i.group.name) || '未设置')
        return groups.map(i => (
          <Tag color="processing" key={i.id}>
            {i}
          </Tag>
        ))
      },
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      render: val => {
        switch (val) {
          case 0:
            return <Tag color="success">正常</Tag>
          case 1:
            return <Tag color="error">已禁用</Tag>
          default:
            return <Tag color="success">正常</Tag>
        }
      },
    },
    {
      title: t('Last Login Time'),
      dataIndex: 'last_login',
      render: login_time => (
        <p>
          {login_time
            ? getLocalTime(login_time).format('YYYY-MM-DD HH:mm:ss')
            : t('Not logged in yet')}
        </p>
      ),
    },
    {
      title: '操作',
      dataIndex: 'more',
      isHideable: true,
      // eslint-disable-next-line no-unused-vars
      render: (_, item) => (
        <div className={styles.btns}>
          {/* <Popover content="查看详情" title="">
            <Button
              type="text"
              size="small"
              style={{ color: '#1890ff' }}
              icon={<EyeOutlined />}
              // onClick={}
            >
              详情
            </Button>
          </Popover> */}
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
          {/* <Popover content="设置角色" title="">
            <Button
              type="text"
              size="small"
              style={{ color: '#faad14' }}
              icon={<UserOutlined />}
              // onClick={}
            >
              设置角色
            </Button>
          </Popover> */}
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

  radioChange(e) {
    // eslint-disable-next-line no-console
    const { value } = e.target
    const params = {
      ...this.state.params,
      status: value,
    }
    this.getData(params)
  }

  selectNode(item) {
    const { params } = this.state
    const newParams = {
      ...params,
      gid: item ? item.id : '',
    }
    this.setState({
      item,
      params: newParams,
    })
    this.getData(newParams)
  }

  handleCreate() {
    this.setState({ isEdit: false, show: true })
  }

  render() {
    const { data, status, show, isEdit, user, item } = this.state

    const onSearch = () => {
      const values = this.form.current.getFieldsValue()
      const params = {
        ...this.state.params,
        ...values,
      }
      this.getData(params)
    }

    const onReset = () => {
      const params = {
        gid: '',
        status: '',
        name: '',
        username: '',
      }
      this.form.current.setFieldsValue(params)
      this.setState({
        params,
      })
      this.getData(params)
    }

    const onCancel = () => {
      this.setState({ show: false })
    }

    // 创建和编辑的回调
    // eslint-disable-next-line no-unused-vars
    const onSubmit = async res => {
      if (!isEdit) {
        const { code, msg } = await addUser(res)
        if (code === 200) {
          Notify.success('添加成功')
          this.setState({ show: false })
          const { params } = this.state
          this.getData(params)
        } else {
          Notify.error(`添加失败!${msg}`)
        }
      } else {
        const { code } = await editUser(res)
        code === 200 ? Notify.success('更新成功') : Notify.error('更新失败')
        this.setState({ show: false })
        const { params } = this.state
        this.getData(params)
      }
    }

    return (
      <div>
        <Banner title="平台用户" description={'用于管理平台的用户'} />
        <Row>
          <Col span={6} style={{ paddingRight: '5px' }}>
            <Tree
              store={this.groupStore}
              select={this.selectNode.bind(this)}
            ></Tree>
          </Col>
          <Col span={18} style={{ paddingLeft: '5px' }}>
            <div className="table-title">
              <Form ref={this.form}>
                <Row justify="space-between" align="middle">
                  <Row
                    justify="space-around"
                    gutter={15}
                    className="margin-b12"
                  >
                    <Col>
                      <Form.Item label="用户名" name="name">
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item label="登录名" name="username">
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Col>
                    <Form.Item>
                      <KButton
                        type="control"
                        onClick={() => this.handleCreate()}
                      >
                        创建
                      </KButton>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Item label="是否禁用" name="status">
                      <Radio.Group
                        onChange={this.radioChange.bind(this)}
                        value={status}
                        defaultValue={''}
                      >
                        <Radio value={''}>全部</Radio>
                        <Radio value={0}>正常</Radio>
                        <Radio value={1}>已禁用</Radio>
                      </Radio.Group>
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
              </Form>
            </div>
            <Table columns={this.getColumns()} dataSource={data} />
          </Col>
        </Row>
        <CreateAndEditModal
          show={show}
          isEdit={isEdit}
          onCancel={onCancel}
          onSubmit={onSubmit}
          treeData={this.groupStore.treeData}
          roleData={this.roleStore.roles}
          item={user}
          group={item}
        ></CreateAndEditModal>
      </div>
    )
  }
}
