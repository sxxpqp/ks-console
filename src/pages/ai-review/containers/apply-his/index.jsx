import React from 'react'
// import { get } from 'lodash'
// import { toJS } from 'mobx'
import Banner from 'components/Cards/Banner'
import { Table, Row, Col, Input, Form, Button, Radio, Tag } from 'antd'

import { EyeOutlined } from '@ant-design/icons'

import { Button as KButton } from '@kube-design/components'
import { observer, inject } from 'mobx-react'
import ReviewStore from 'stores/ai-platform/review'
import dayjs from 'dayjs'
import styles from './index.scss'
import Detail from './detail'

@inject('rootStore')
@observer
export default class ApplyHistory extends React.Component {
  constructor(props) {
    super(props)
    this.form = React.createRef()
    this.store = new ReviewStore()
    this.store.getApplyHis()
    this.state = {
      status: -1,
      value: '',
      show: false,
      item: null,
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
          <Button
            type="text"
            size="small"
            style={{ color: '#096dd9' }}
            icon={<EyeOutlined />}
            onClick={() => this.showDetail(record)}
          >
            详情
          </Button>
        </div>
      ),
    },
  ]

  showDetail(item) {
    this.setState({
      show: true,
      item,
    })
  }

  radioChange(e) {
    const { value } = e.target
    // eslint-disable-next-line no-console
    this.store.setParams({
      current: 1,
      status: value,
    })
    this.store.getApplyHis()
  }

  handleInput(e) {
    const { value } = e.target
    this.store.setParams({
      reason: value,
    })
  }

  handleSearch() {
    this.store.getApplyHis()
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
      })
      this.store.getApplyHis()
    }
  }

  render() {
    // 查看历史
    const showApply = () => {
      const { workspace, cluster, namespace } = this.props.match.params
      const { history } = this.props
      const PATH = `/${workspace}/clusters/${cluster}/projects/${namespace}/apply`
      history.push({ pathname: PATH, state: { name: 'apply' } })
    }

    const onCancel = () => {
      this.setState({
        show: false,
      })
    }

    const { allHis, params } = this.store
    const { status, value, show, item } = this.state

    return (
      <>
        <Banner
          title="资源申请历史"
          description="用户申请资源历史，可以查看资源审批的状态与驳回理由"
        />
        <div className="table-title">
          <Form ref={this.form}>
            <Row justify="space-between" align="middle">
              <Row justify="space-around" gutter={15}>
                <Col>
                  <Form.Item label="事由" name="reason">
                    <Input
                      placeholder="请输入搜索关键词"
                      value={value}
                      onChange={this.handleInput.bind(this)}
                    />
                  </Form.Item>
                </Col>
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
              <Col>
                <Form.Item>
                  <KButton type="control" onClick={() => showApply()}>
                    新增申请
                  </KButton>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <Table
          columns={this.getColumns()}
          dataSource={allHis}
          pagination={{ params }}
        />
        <Detail show={show} item={item} onCancel={onCancel}></Detail>
      </>
    )
  }
}
