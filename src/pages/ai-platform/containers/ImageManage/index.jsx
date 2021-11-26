import React from 'react'
// import { get } from 'lodash'
// import { toJS } from 'mobx'
import Banner from 'components/Cards/Banner'
import {
  // Popover,
  Table,
  Row,
  Col,
  Input,
  Form,
  Button,
  Radio,
  // Select,
  Modal,
} from 'antd'

import {
  EyeOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'

import {
  Button as KButton,
  // Notify
} from '@kube-design/components'
import { observer, inject } from 'mobx-react'

import dayjs from 'dayjs'
import styles from './index.scss'

// const { Option } = Select

@inject('homeStore')
@observer
export default class CustomApplications extends React.Component {
  constructor(props) {
    super(props)
    this.form = React.createRef()
    this.ctrl = null
    this.store = this.props.homeStore
    this.props.homeStore.getUserImages()
  }

  get namespace() {
    return this.props.match.params.namespace
  }

  get workspace() {
    return this.props.match.params.workspace
  }

  get prefix() {
    const { workspace, cluster, namespace } = this.props.match.params
    return `/${workspace}/clusters/${cluster}/projects/${namespace}/applications/`
  }

  get username() {
    return globals.user.username
  }

  getColumns = () => [
    {
      title: '名称',
      dataIndex: 'name',
      // render: val => val.replace(new RegExp(`${this.username}/`, 'g'), ''),
    },
    {
      title: '下载次数',
      dataIndex: 'pull_count',
      render: val => val || 0,
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'creation_time',
      render: created => dayjs(created).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
      render: created => dayjs(created).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '标签',
      dataIndex: 'artifact_count',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'more',
      align: 'center',
      // eslint-disable-next-line no-unused-vars
      render: (_, record) => (
        <div className={styles.btns}>
          <Button
            type="text"
            size="small"
            style={{ color: '#1890ff' }}
            icon={<EyeOutlined />}
            onClick={() => this.handleDetail(record)}
          >
            详情
          </Button>
          {this.store.pagination.type === 1 && (
            <Button
              type="text"
              size="small"
              style={{ color: '#ff7875' }}
              icon={<DeleteOutlined />}
              onClick={() => this.handleDelete(record)}
            >
              删除
            </Button>
          )}
        </div>
      ),
    },
  ]

  // 查看应用详情
  handleDetail = record => {
    const { history } = this.props
    const type = record.type ? 'composing' : 'template'
    history.push({
      pathname: `${this.prefix}${type}/${record.appId}`,
      state: {
        prevPath: location.pathname,
      },
    })
  }

  // 删除应用
  handleDelete = record => {
    Modal.confirm({
      title: `确定删除应用${record.name}吗？`,
      icon: <ExclamationCircleOutlined />,
      centered: true,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        // removeApp(record.appId).then(res => {
        //   const { code } = res
        //   if (code === 200) {
        //     const { pagination } = this.appStore
        //     this.appStore.getData(pagination)
        //     Notify.success('删除成功')
        //   } else {
        //     Notify.success('删除失败，请重试')
        //   }
        // })
      },
    })
  }

  // // 分页
  // handlePaginationChange(value) {
  //   const { pagination } = this.appStore
  //   const newPaging = { ...pagination, current: value }
  //   this.appStore.pagination = newPaging
  //   this.appStore.getData(newPaging)
  // }

  // 应用状态变化
  radioChange(type, e) {
    const { value } = e.target
    const { pagination } = this.store
    const newPaging = {
      ...pagination,
      [type]: value,
      pageSize: 10,
      current: 1,
    }
    this.store.pagination = newPaging
    this.store.getUserImages()
    // this.appStore.getData(newPaging)
  }

  render() {
    // const { templates } = this.store
    const { imageList: lists, pagination } = this.props.homeStore

    const onSearch = () => {
      const values = this.form.current.getFieldsValue()
      this.store.pagination = {
        ...pagination,
        ...values,
      }
      this.store.getUserImages()
    }
    const onReset = () => {
      this.form.current.setFieldsValue({
        pageSize: 10,
        current: 1,
        total: 0,
        type: 1,
        name: '',
      })
      const newPaging = {
        ...pagination,
        current: 1,
        pageSize: 10,
        type: 1,
        name: '',
      }
      this.store.pagination = newPaging
      this.store.getUserImages(newPaging)
    }

    return (
      <>
        <Banner
          title="镜像管理"
          description="容器平台提供镜像自制与镜像管理，可以搜索并使用公司镜像库中的镜像。"
        />
        <div className="table-title">
          <Form ref={this.form}>
            <Row justify="space-between" align="middle" className="margin-b12">
              <Row justify="space-around" gutter={15}>
                <Col>
                  <Form.Item label="镜像分类" name="type">
                    <Radio.Group
                      defaultValue={1}
                      onChange={this.radioChange.bind(this, 'type')}
                    >
                      <Radio value={1}>私有仓库</Radio>
                      <Radio value={2}>公共仓库</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item
                    label="镜像名称"
                    name="name"
                    style={{ width: '280px', marginRight: '10px' }}
                  >
                    <Input placeholder="请输入筛选的名称" />
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
              {/* <Col>
                <Form.Item>
                  <KButton type="control" onClick={this.showDeploy}>
                    自制镜像
                  </KButton>
                </Form.Item>
              </Col> */}
            </Row>
          </Form>
        </div>
        <Table
          columns={this.getColumns()}
          dataSource={lists}
          pagination={pagination}
        />
      </>
    )
  }
}
