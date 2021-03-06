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
  //       title: '????????????',
  //       description:
  //         '??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????',
  //     },
  //     {
  //       title: '????????????',
  //       description: '?????????????????????????????????????????????????????????????????????????????????',
  //     },
  //   ]
  // }

  get tableColumns() {
    return [
      {
        title: '??????',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '????????????',
        dataIndex: 'name',
        render: value => t(value),
      },
      {
        title: '????????????',
        dataIndex: 'type',
        render: (val, record) => {
          switch (val) {
            case 0:
              return <Tag color="processing">??????</Tag>
            case 1:
              return <Tag color="success">??????</Tag>
            case 2:
              return <Tag color="error">??????</Tag>
            default:
              return <Tag color="processing">??????</Tag>
          }
        },
        align: 'center',
      },
      {
        title: '??????',
        dataIndex: 'path',
        width: '25%',
        ellipsis: true,
      },
      {
        title: '????????????',
        dataIndex: 'route',
      },
      {
        title: '??????',
        dataIndex: 'sort',
        align: 'center',
      },
      {
        title: '????????????',
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
        title: '????????????',
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
              ??????
            </Button>
            <Button
              type="text"
              size="small"
              danger
              onClick={() => this.handleRemove(record)}
            >
              <Icons.ExportOutlined />
              ??????
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
        ? `????????????"${record.name}"????????????`
        : `????????????"${record.name}"????????????`
    Modal.confirm({
      title: msg,
      icon: <ExclamationCircleOutlined />,
      centered: true,
      okText: '??????',
      cancelText: '??????',
      onOk: () => {
        editMenu({
          id: record.id,
          status: record.status === 0 ? 1 : 0,
        })
          .then(res => {
            if (res.code === 200) {
              Notify.success({ content: `??????????????????` })
            } else {
              Notify.error({ content: `????????????????????????` })
            }
            this.getData()
          })
          .catch(err => {
            Notify.error({ content: `????????????????????????????????????` })
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
      title: `???????????? ${t(item.name) || item.name} ???????????????`,
      icon: <ExclamationCircleOutlined />,
      centered: true,
      okText: '??????',
      cancelText: '??????',
      onOk: () => {
        removeMenu({
          id: item.id,
        }).then(res => {
          if (res.code === 200) {
            Notify.success('????????????')
            // this.selectNode(null)
            this.getData()
          } else {
            Notify.success('????????????????????????')
          }
        })
      },
    })
  }

  handleBatchDelete() {
    // const menuName = this.state.selectedRows.map(i => i.name).join(',')
    Modal.confirm({
      title: `?????????????????????????????????`,
      icon: <ExclamationCircleOutlined />,
      centered: true,
      okText: '??????',
      cancelText: '??????',
      onOk: () => {
        this.setState({
          selectedRowKeys: [],
          selectedRows: [],
        })
        batchRemoveMenu({
          ids: this.state.selectedRowKeys,
        }).then(res => {
          if (res.code === 200) {
            Notify.success('????????????')
            // this.selectNode(null)
            this.getData()
          } else {
            Notify.success('????????????????????????')
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

    // ????????????????????????
    const onSubmit = async res => {
      if (!isEdit) {
        const { code } = await addMenu(res)
        // const { code } = await this.store.addData(res)
        code === 200 ? Notify.success('????????????') : Notify.error('????????????')
      } else {
        const { code } = await editMenu(res)
        code === 200 ? Notify.success('????????????') : Notify.error('????????????')
      }
      this.setState({ show: false })
      this.getData()
    }

    // ??????
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
        <Banner title="????????????" description="??????????????????????????????????????????" />
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
                    <Form.Item label="????????????" name="status">
                      <Radio.Group
                        onChange={e => this.handleRadioChange(e.target.value)}
                      >
                        <Radio value={''}>??????</Radio>
                        <Radio value={1}>??????</Radio>
                        <Radio value={0}>??????</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col>
                    <Row justify="space-between">
                      <Col>
                        <Form.Item
                          label="????????????"
                          name="name"
                          style={{ width: '280px', marginRight: '10px' }}
                        >
                          <Input
                            placeholder="??????????????????????????????"
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
                            ??????
                          </KButton>
                          <KButton type="default" onClick={onReset}>
                            ??????
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
                      ??????
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
                    ????????????
                  </KButton> */}
                  <KButton
                    type="danger"
                    onClick={() => this.handleBatchDelete()}
                  >
                    ????????????
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
