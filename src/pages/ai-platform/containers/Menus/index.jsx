/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React from 'react'
import Banner from 'components/Cards/Banner'
// import { Modal } from 'components/Base'
import { withProjectList, ListPage } from 'components/HOCs/withList'
import {
  Level,
  LevelItem,
  LevelLeft,
  LevelRight,
  Button as KButton,
  Pagination,
  Notify,
} from '@kube-design/components'
import {
  Table,
  Switch,
  Button,
  Tag,
  Modal,
  Row,
  Col,
  Form,
  Radio,
  Input,
} from 'antd'
import MenuModal from 'components/Modals/MenuCreate'

import UserStore from 'stores/user'
import RoleStore from 'stores/role'
import * as Icons from '@ant-design/icons'
import {
  getMenus,
  addMenu,
  removeMenu,
  editMenu,
  batchRemoveMenu,
} from 'api/users'
import { getTreeData } from 'utils/menu'
import DeleteModal from 'components/Modals/Delete'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import CreateAndEditModal from './form'
import styles from './index.scss'

@withProjectList({
  store: new UserStore(),
  module: 'users',
  authKey: 'members',
  name: 'Project Member',
  rowKey: 'username',
})
export default class Members extends React.Component {
  roleStore = new RoleStore()

  constructor(props) {
    super(props)
    this.state = {
      checkStrictly: false,
      data: [],
      show: false,
      isEdit: false,
      item: null,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        name: '',
        status: '',
        onChange: this.handlePaginationChange.bind(this),
      },
      selectedRowKeys: [],
      selectedRows: [],
    }
    this.form = React.createRef()
  }

  async getData() {
    const { code, data } = await getMenus(this.state.pagination)
    if (code === 200) {
      const tree = getTreeData(data, -1)
      this.setState({
        data: tree || [],
        total: tree.length || 0,
      })
    }
  }

  componentDidMount() {
    this.getData()
    this.form &&
      this.form.current.setFieldsValue({
        status: '',
      })
  }

  // get tips() {
  //   return [
  //     {
  //       title: '创建菜单',
  //       description:
  //         '新建菜单，可以编辑菜单的名称、路径、路由，类型默认为菜单（还可以设置成目录，即有子菜单层级）、链接（外部链接跳转）。',
  //     },
  //     {
  //       title: '菜单编辑',
  //       description: '可以通过编辑功能来调整菜单的属性，设置菜单的隐藏与显示',
  //     },
  //   ]
  // }

  get tableColumns() {
    return [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '菜单名称',
        dataIndex: 'name',
        render: value => t(value),
      },
      {
        title: '菜单类型',
        dataIndex: 'type',
        render: (val, record) => {
          switch (val) {
            case 0:
              return <Tag color="processing">菜单</Tag>
            case 1:
              return <Tag color="success">目录</Tag>
            case 2:
              return <Tag color="error">链接</Tag>
            default:
              return <Tag color="processing">菜单</Tag>
          }
        },
        align: 'center',
      },
      {
        title: '路径',
        dataIndex: 'path',
        width: '25%',
        ellipsis: true,
      },
      {
        title: '菜单路由',
        dataIndex: 'route',
      },
      {
        title: '排序',
        dataIndex: 'sort',
        align: 'center',
      },
      {
        title: '是否启用',
        dataIndex: 'status',
        align: 'center',
        render: (status, record) => {
          return (
            <Switch
              defaultChecked={status === 1}
              checked={status === 1}
              onClick={() => this.setMenuStatus(record)}
            />
          )
        },
      },
      {
        title: '操作菜单',
        width: '20%',
        render: (text, record) => (
          <div className={styles.btns}>
            <Button
              type="text"
              size="small"
              style={{ color: '#1890ff' }}
              onClick={() => this.handleEdit(record)}
            >
              <Icons.EditOutlined />
              编辑
            </Button>
            <Button
              type="text"
              size="small"
              danger
              onClick={() => this.handleRemove(record)}
            >
              <Icons.ExportOutlined />
              删除
            </Button>
          </div>
        ),
      },
    ]
  }

  handlePaginationChange = value => {
    this.state.pagination = { ...this.state.pagination, current: value }
    this.getData()
  }

  setMenuStatus(record) {
    const msg =
      record.status === 0
        ? `确定禁用"${record.name}"菜单吗？`
        : `确定启用"${record.name}"菜单吗？`
    Modal.confirm({
      title: msg,
      icon: <ExclamationCircleOutlined />,
      centered: true,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        editMenu({
          id: record.id,
          status: record.status === 0 ? 1 : 0,
        })
          .then(res => {
            if (res.code === 200) {
              Notify.success({ content: `更新菜单成功` })
            } else {
              Notify.error({ content: `更新失败，请重试` })
            }
            this.getData()
          })
          .catch(err => {
            Notify.error({ content: `服务端错误，接口请求失败` })
          })
      },
    })
  }

  formatData(arr) {
    arr = arr.map(item => {
      item = {
        ...item,
        title: t(item.name),
        value: item.id,
      }
      if (item.children) {
        item.children = this.formatData(item.children)
      }
      return item
    })
    return arr
  }

  handleCreate() {
    this.setState({ isEdit: false, show: true })
  }

  handleEdit(record) {
    this.setState({ isEdit: true, show: true, item: record })
  }

  handleRemove(item) {
    Modal.confirm({
      title: `确定删除 ${t(item.name) || item.name} 的菜单吗？`,
      icon: <ExclamationCircleOutlined />,
      centered: true,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        removeMenu({
          id: item.id,
        }).then(res => {
          if (res.code === 200) {
            Notify.success('删除成功')
            // this.selectNode(null)
            this.getData()
          } else {
            Notify.success('删除失败，请重试')
          }
        })
      },
    })
  }

  handleBatchDelete() {
    // const menuName = this.state.selectedRows.map(i => i.name).join(',')
    Modal.confirm({
      title: `确定删除所选的菜单吗？`,
      icon: <ExclamationCircleOutlined />,
      centered: true,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.setState({
          selectedRowKeys: [],
          selectedRows: [],
        })
        batchRemoveMenu({
          ids: this.state.selectedRowKeys,
        }).then(res => {
          if (res.code === 200) {
            Notify.success('删除成功')
            // this.selectNode(null)
            this.getData()
          } else {
            Notify.success('删除失败，请重试')
          }
        })
      },
    })
  }

  handleInputChange(val) {
    if (!val) {
      this.setState(
        {
          pagination: {
            ...this.state.pagination,
            name: '',
          },
        },
        () => {
          this.getData()
        }
      )
    }
  }

  handleRadioChange(val) {
    this.setState(
      {
        pagination: {
          ...this.state.pagination,
          status: val,
        },
      },
      () => {
        this.getData()
      }
    )
  }

  render() {
    const { checkStrictly, data, item, show, isEdit, pagination } = this.state

    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys,
          selectedRows,
        })
      },
      // onSelect: (record, selected, selectedRows) => {
      //   console.log(record, selected, selectedRows)
      // },
      // onSelectAll: (selected, selectedRows, changeRows) => {
      //   console.log(selected, selectedRows, changeRows)
      // },
    }

    const onCancel = () => {
      this.setState({ show: false, item: null, isEdit: false })
    }

    // 创建和编辑的回调
    const onSubmit = async res => {
      if (!isEdit) {
        const { code } = await addMenu(res)
        // const { code } = await this.store.addData(res)
        code === 200 ? Notify.success('添加成功') : Notify.error('添加失败')
      } else {
        const { code } = await editMenu(res)
        code === 200 ? Notify.success('更新成功') : Notify.error('更新失败')
      }
      this.setState({ show: false })
      this.getData()
    }

    // 清空
    const onReset = () => {
      this.form &&
        this.form.current.setFieldsValue({
          status: '',
          name: '',
        })
      this.setState(
        {
          pagination: {
            ...this.state.pagination,
            current: 1,
            pageSize: 10,
            total: 0,
            name: '',
            status: '',
          },
        },
        () => {
          this.getData()
        }
      )
    }

    const onSearch = () => {
      const params = this.form.current.getFieldsValue()
      this.setState(
        {
          pagination: {
            ...this.state.pagination,
            ...params,
          },
        },
        () => {
          this.getData()
        }
      )
    }

    return (
      <div className={styles.wrapper}>
        <Banner title="平台菜单" description="用于管理平台的菜单与层级结构" />
        <div className={styles.table}>
          <div className="table-title">
            <Form ref={this.form}>
              <Row
                justify="space-between"
                align="middle"
                className="margin-b12"
              >
                <Row justify="space-around" gutter={15}>
                  <Col>
                    <Form.Item label="是否启用" name="status">
                      <Radio.Group
                        onChange={e => this.handleRadioChange(e.target.value)}
                      >
                        <Radio value={''}>全部</Radio>
                        <Radio value={1}>启用</Radio>
                        <Radio value={0}>禁用</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col>
                    <Row justify="space-between">
                      <Col>
                        <Form.Item
                          label="菜单名称"
                          name="name"
                          style={{ width: '280px', marginRight: '10px' }}
                        >
                          <Input
                            placeholder="请输入筛选的菜单名称"
                            allowClear
                            onChange={e =>
                              this.handleInputChange(e.target.value)
                            }
                          />
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
                  </Col>
                </Row>
                <Col>
                  <Form.Item>
                    <KButton
                      type="control"
                      onClick={this.handleCreate.bind(this)}
                    >
                      创建
                    </KButton>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            {this.state.selectedRowKeys.length > 0 && (
              <Row className="margin-b12">
                <Col>
                  {/* <KButton
                    type="control"
                    onClick={() => this.handleBatchEdit()}
                  >
                    批量设置
                  </KButton> */}
                  <KButton
                    type="danger"
                    onClick={() => this.handleBatchDelete()}
                  >
                    批量删除
                  </KButton>
                </Col>
              </Row>
            )}
          </div>
          <Table
            rowKey="id"
            columns={this.tableColumns}
            rowSelection={{ ...rowSelection, checkStrictly }}
            dataSource={data}
            pagination={pagination}
          />
        </div>
        <CreateAndEditModal
          show={show}
          isEdit={isEdit}
          onCancel={onCancel}
          onSubmit={onSubmit}
          treeData={data}
          item={item}
        ></CreateAndEditModal>
      </div>
    )
  }
}
