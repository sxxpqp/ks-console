import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import {
  Form,
  // Select, TextArea
} from '@kube-design/components'
import { Modal } from 'components/Base'
import { Tag, Input, Table, Descriptions } from 'antd'
// import { getNodes } from 'api/apply'
import styles from './index.scss'

const { TextArea } = Input

@observer
export default class AuditDetailModal extends React.Component {
  static propTypes = {
    detail: PropTypes.object,
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    isSubmitting: PropTypes.bool,
  }

  static defaultProps = {
    visible: false,
    isSubmitting: false,
    detail: {},
    onOk() {},
    onCancel() {},
  }

  constructor(props) {
    super(props)
    this.state = {
      msg: '',
      nodes: [],
      key: [],
      rowData: {},
      remain: {},
    }
  }

  async componentDidMount() {
    const { reviewStore, detail } = this.props
    await reviewStore.getResTotal(detail.uid)
    // 获取用户的组织
    // 通过组织获取用户的组织节点
    // getNodes().then(res => {
    //   if (res.status === 200) {
    //     const { data } = res
    //     const { code, data: nodes } = data
    //     code === 200 &&
    //       this.setState({
    //         nodes,
    //       })
    //   }
    // })
  }

  handleOk() {
    const { onOk } = this.props
    onOk(this.state)
  }

  renderForm = items => {
    const columns = [
      {
        title: 'vCPU',
        dataIndex: 'cpu',
        render: item => `${item} Core`,
      },
      {
        title: '内存',
        dataIndex: 'mem',
        render: item => `${item} GiB`,
      },
      {
        title: 'vGPU',
        dataIndex: 'gpu',
        render: item => `${item} Core`,
      },
      {
        title: '磁盘',
        dataIndex: 'disk',
        render: item => `${item} GB`,
      },
      // {
      //   title: '节点类型',
      //   dataIndex: 'type',
      //   render: item => {
      //     let tag
      //     switch (item) {
      //       case 1:
      //         tag = <Tag color="processing">不限</Tag>
      //         break
      //       case 2:
      //         tag = <Tag color="success">优先自有</Tag>
      //         break
      //       case 3:
      //         tag = <Tag color="error">仅自有</Tag>
      //         break
      //       default:
      //         tag = <Tag color="processing">不限</Tag>
      //     }
      //     return tag
      //   },
      // },
    ]
    return (
      <Table
        bordered={true}
        columns={columns}
        dataSource={items}
        pagination={{ position: ['none', 'none'] }}
        // scroll={{ y: 320 }}
      />
    )
  }

  // 返回资源节点情况
  renderNodes() {
    const { nodes, key } = this.state
    const { detail } = this.props
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        const data = selectedRows.length > 0 ? selectedRows[0] : {}
        this.setState({
          key: selectedRowKeys,
          rowData: data,
          remain: {
            cpu: data.cpu - detail.cpu,
            mem: data.mem - detail.mem,
            disk: data.disk - detail.disk,
            gpu: data.gpu - detail.gpu,
          },
        })
      },
      getCheckboxProps: record => ({
        disabled:
          record.cpu - detail.cpu < 0 ||
          record.gpu - detail.gpu < 0 ||
          record.mem - detail.mem < 0 ||
          record.disk - detail.disk < 0, // Column configuration not to be checked
      }),
    }
    const columns = [
      {
        title: '节点',
        dataIndex: 'node',
      },
      {
        title: 'vCPU剩余',
        dataIndex: 'cpuRest',
        render: item => `${item} vCPU`,
      },
      {
        title: 'CPU %',
        dataIndex: 'cpu',
        render: (_, record) => `${((record.cpuRest / _) * 100).toFixed(2)}%`,
      },
      {
        title: '内存剩余',
        dataIndex: 'memRest',
        render: item => `${item} GiB`,
      },
      {
        title: 'vGPU剩余',
        dataIndex: 'gpuRest',
        render: item => `${item}`,
      },
      {
        title: '磁盘剩余',
        dataIndex: 'diskRest',
        render: item => `${item} GiB`,
      },
    ]

    const { remain } = this.state
    const msg = `选择后，资源剩余: CPU: ${remain.cpu} vCPU, 内存: ${remain.mem} GiB,
            磁盘: ${remain.disk} GiB, GPU: ${remain.gpu} vGPU`
    return (
      <>
        <Table
          bordered={true}
          rowKey="id"
          rowSelection={{
            type: 'radio',
            ...rowSelection,
            selectedRowKeys: key,
          }}
          columns={columns}
          dataSource={nodes}
          pagination={{ position: ['none', 'none'] }}
          scroll={{ y: 320 }}
        />
        {key.length > 0 && <span className={styles.choose}>{msg}</span>}
      </>
    )
  }

  renderUser(user) {
    return (
      <Descriptions title="" bordered>
        <Descriptions.Item label="用户名称">{user.name}</Descriptions.Item>
        <Descriptions.Item label="部门" span={2}>
          {user.users_groups.map(i => (
            <Tag color="processing">{i.group.name}</Tag>
          ))}
        </Descriptions.Item>
      </Descriptions>
    )
  }

  handleInputChange(e) {
    this.setState({
      msg: e,
    })
  }

  render() {
    const {
      detail,
      visible,
      onCancel,
      isSubmitting,
      icon = '',
      title = '查看详情',
    } = this.props

    const { msg } = this.state

    return (
      <Modal.Form
        width={691}
        title={title}
        icon={icon}
        data={detail}
        onOk={this.handleOk.bind(this)}
        onCancel={onCancel}
        isSubmitting={isSubmitting}
        visible={visible}
      >
        <Form.Item label={'用户信息'}>{this.renderUser(detail.user)}</Form.Item>
        <Form.Item label={'已申请信息'}>
          {this.renderForm([this.props.reviewStore.countRes])}
        </Form.Item>
        <Form.Item label={'新申请配置'}>{this.renderForm([detail])}</Form.Item>
        <Form.Item label={'申请理由'}>
          <TextArea name="reason" disabled rows={4} />
        </Form.Item>
        {/* <Form.Item label={'节点资源选择'}>{this.renderNodes()}</Form.Item> */}
        <Form.Item label={'审批理由(选填)'}>
          <TextArea
            rows={4}
            placeholder="请输入审批消息..."
            value={msg}
            onChange={this.handleInputChange.bind(this)}
          ></TextArea>
        </Form.Item>
      </Modal.Form>
    )
  }
}
