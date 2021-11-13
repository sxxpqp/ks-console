import React from 'react'
import { get } from 'lodash'
// import { toJS } from 'mobx'
import Banner from 'components/Cards/Banner'
import {
  Table,
  Row,
  Col,
  Input,
  Form,
  Button,
  Radio,
  Tag,
  TreeSelect,
  Modal,
} from 'antd'
import { Notify, Button as KButton } from '@kube-design/components'

import {
  EyeOutlined,
  AuditOutlined,
  ExportOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'

import { observer, inject } from 'mobx-react'
import ReviewStore from 'stores/ai-platform/review'
import GroupStore from 'stores/ai-platform/group'
import dayjs from 'dayjs'
import { getUsers } from 'api/users'
// import VersionStore from 'stores/openpitrix/version'
import AppStore from 'stores/openpitrix/app'
import { updateApply } from 'api/apply'
import styles from './index.scss'
import Detail from './detail'

@inject('rootStore')
@observer
export default class ApplyHistory extends React.Component {
  constructor(props) {
    super(props)
    this.form = React.createRef()
    this.store = new ReviewStore()

    this.store.getApplyHisAll()
    this.appStore = new AppStore()
    // this.versionStore = new VersionStore()

    // 获取组织资源
    // this.store.getGroupResTotal()
    this.groupStore = new GroupStore()
    this.groupStore.getData()
    this.state = {
      status: 0,
      value: '',
      show: false,
      item: null,
      user: null,
      groupRes: null,
      userRes: null,
    }
  }

  get routing() {
    return this.props.rootStore.routing
  }

  getColumns = () => [
    {
      title: 'cpu',
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
      title: '创建时间',
      dataIndex: 'created',
      render: time => dayjs(time).format('YYYY-MM-DD hh:mm:ss'),
    },
    {
      title: '申请人',
      dataIndex: 'user',
      render: user => user.name,
    },
    {
      title: '事由',
      dataIndex: 'reason',
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      render: val => {
        switch (parseInt(val, 10)) {
          case 0:
            return <Tag color="processing">未审核</Tag>
          case 1:
            return <Tag color="success">已审核</Tag>
          case 2:
            return <Tag color="error">已驳回</Tag>
          default:
            return <Tag color="processing">未审核</Tag>
        }
      },
    },
    {
      title: '操作',
      dataIndex: 'more',
      // eslint-disable-next-line no-unused-vars
      render: (_, record) => (
        <div className={styles.btns}>
          {record.status === 0 ? (
            <>
              <Button
                type="text"
                size="small"
                style={{ color: '#389e0d' }}
                onClick={() => this.showDetail(record)}
              >
                <AuditOutlined />
                审批
              </Button>
              <Button
                type="text"
                size="small"
                danger
                onClick={() => this.handleRefuse(record)}
              >
                <ExportOutlined />
                驳回
              </Button>
            </>
          ) : (
            <Button
              type="text"
              size="small"
              style={{ color: '#096dd9' }}
              onClick={() => this.showDetail(record)}
            >
              <EyeOutlined />
              查看详情
            </Button>
          )}
          {/* <Button type="text" danger size="small">
              <DeleteOutlined />
              删除
            </Button> */}
        </div>
      ),
    },
  ]

  async showDetail(item) {
    const res = await getUsers({ id: item.uid })
    const { code, data, msg } = res
    if (code === 200) {
      const groups = get(data[0], 'users_groups')
      const gres = await this.store.getGroupResTotal({
        id: groups.map(i => i.gid).join(','),
      })
      const user = await this.store.getResTotal(item.uid)
      if (item.app) {
        this.appStore.fetchDetail({
          appId: item.app,
        })
      }
      this.setState({
        show: true,
        item,
        user: data[0],
        groupRes: gres.code === 200 ? gres.data : [],
        userRes: user.code === 200 ? user.data : [],
      })
    } else {
      Notify.error(msg || '无法获取用户信息')
    }
  }

  radioChange(e) {
    const { value } = e.target
    // eslint-disable-next-line no-console
    this.store.setParams({
      current: 1,
      status: value,
    })
    this.store.getApplyHisAll()
  }

  onTreeChange(e) {
    this.store.setParams({
      gid: e,
    })
    // eslint-disable-next-line no-console
    // this.store.setParams({
    //   current: 1,
    //   status: value,
    // })
    // this.store.getApplyHisAll()
  }

  handleInput(e) {
    const { value } = e.target
    this.store.setParams({
      name: value,
    })
  }

  handleSearch() {
    this.store.getApplyHisAll()
  }

  handleReset() {
    if (this.form.current) {
      this.form.current.resetFields()
      this.setState({
        status: -1,
      })
      this.store.setParams({
        current: 1,
        status: -1,
        reason: '',
        name: '',
        gid: null,
      })
      setTimeout(() => {
        this.store.getApplyHisAll()
      }, 0)
    }
  }

  handleRefuse(item) {
    const { user } = item
    Modal.confirm({
      title: `确定驳回组织${user.name}的申请吗？`,
      icon: <ExclamationCircleOutlined />,
      centered: true,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.onSubmit(0, item)
      },
    })
  }

  // modal取消
  onCancel = () => {
    this.setState({
      show: false,
    })
  }

  // modal确定
  onSubmit = async (flag, item) => {
    this.setState({
      show: false,
    })
    const { id, msg } = item
    const res = await updateApply({
      id,
      msg,
      status: flag || 2, // 通过
    })
    if (res.code === 200) {
      Notify.success({ content: flag ? `审批成功` : `驳回成功` })
      // this.store.getApplyHisAll()
    }
    this.store.getApplyHisAll()
  }

  render() {
    // 查看历史
    const showApply = () => {
      const { workspace, cluster, namespace } = this.props.match.params
      const { history } = this.props
      const PATH = `/${workspace}/clusters/${cluster}/projects/${namespace}/apply`
      history.push({ pathname: PATH, state: { name: 'apply' } })
    }

    const { allAdminHis, params } = this.store
    const { status, value, show, item, user, groupRes, userRes } = this.state

    return (
      <>
        <Banner
          title="容器资源审批"
          description="人工智能平台用户申请的资源清单，查看资源详情，对资源申请进行审批。"
        />
        <div className="table-title">
          <Form ref={this.form}>
            <Row justify="space-between" align="middle" className="margin-b12">
              <Row justify="space-around" gutter={15}>
                <Col>
                  <Form.Item label="审核状态" name="status">
                    <Radio.Group
                      onChange={this.radioChange.bind(this)}
                      defaultValue={status}
                    >
                      <Radio value={-1}>全部</Radio>
                      <Radio value={0}>未审核</Radio>
                      <Radio value={1}>已审核</Radio>
                      <Radio value={2}>已驳回</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
              <Col>
                <Form.Item>
                  <KButton type="control" onClick={() => showApply()}>
                    新增申请
                  </KButton>
                </Form.Item>
              </Col>
            </Row>
            <Row justify="start" align="middle" gutter={15}>
              <Col>
                <Form.Item label="组织" name="gid">
                  <TreeSelect
                    showSearch
                    style={{
                      width: '180px',
                      borderRadius: '2px',
                      border: '1px solid #d9d9d9',
                    }}
                    dropdownStyle={{ overflow: 'auto' }}
                    dropdownMatchSelectWidth={false}
                    placeholder="请选择部门"
                    allowClear
                    treeDefaultExpandAll
                    // initialValues={-1}
                    onChange={this.onTreeChange.bind(this)}
                    fieldNames={{ label: 'name', value: 'id', key: 'id' }}
                    treeData={this.groupStore.treeData}
                  >
                    {/* <TreeNode value="-1" title="无"></TreeNode> */}
                  </TreeSelect>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label="用户名" name="name">
                  <Input
                    placeholder="请输入搜索的用户"
                    value={value}
                    onChange={this.handleInput.bind(this)}
                  />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <KButton type="control" onClick={() => this.handleSearch()}>
                    搜索
                  </KButton>
                  <KButton type="default" onClick={() => this.handleReset()}>
                    清空
                  </KButton>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <Table
          columns={this.getColumns()}
          dataSource={allAdminHis}
          pagination={{ params }}
        />
        <Detail
          show={show}
          item={item}
          user={user}
          groupRes={groupRes}
          userRes={userRes}
          appStore={this.appStore}
          onSubmit={this.onSubmit}
          onCancel={this.onCancel}
        ></Detail>
      </>
    )
  }
}
