import React, { Component } from 'react'
import {
  Modal,
  Form,
  Input,
  Row,
  Col,
  Tag,
  Statistic,
  Descriptions,
  // Alert,
} from 'antd'
import { Button as KButton } from '@kube-design/components'
import { Panel } from 'components/Base'
import { get } from 'lodash'
import { getSum } from 'stores/ai-platform/review'
import { observer } from 'mobx-react'
import styles from './index.scss'

const { TextArea } = Input

@observer
export default class Detail extends Component {
  constructor(props) {
    super(props)
    this.form = React.createRef()
  }

  componentDidUpdate() {
    const { item } = this.props
    // console.log(this.props.appStore)
    if (this.form.current) {
      this.form.current.setFieldsValue(item)
    }
  }

  renderStatus(val) {
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
  }

  get groupResourceTotal() {
    const { groupRes } = this.props
    return getSum(groupRes)
  }

  get userResTotal() {
    const { userRes } = this.props
    return getSum(userRes)
  }

  get groupResourceUsedTotal() {
    const { groupRes } = this.props
    return getSum(groupRes, 1)
  }

  get appDetail() {
    return this.props.appStore.detail
  }

  render() {
    const { show, item, onCancel, onSubmit, user } = this.props

    const handleCancel = () => {
      this.form.current.resetFields()
      onCancel && onCancel()
    }
    const handleApply = flag => {
      onSubmit && onSubmit(flag, this.form.current.getFieldsValue())
      this.form.current.resetFields()
    }

    let groups = []
    if (user) {
      groups = get(user, 'users_groups').map(i => i.group.name)
    }

    return (
      item &&
      user && (
        <Modal
          title={'查看详情'}
          centered
          visible={show}
          footer={null}
          // okText="确定"
          // cancelText="取消"
          // onOk={() => this.handleModal(false)}
          onCancel={handleCancel}
          className={styles.modal}
          width={800}
        >
          <Form
            name="form"
            ref={this.form}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            // onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            // initialValues={isEdit ? item : { pid: item.pid || -1, type: 1 }}
            autoComplete="off"
            className="margin-b12"
          >
            <Panel title="申请者信息">
              <Descriptions title="" bordered>
                <Descriptions.Item label="申请人">
                  {user.name}
                </Descriptions.Item>
                <Descriptions.Item label="部门" span={2}>
                  {groups.map(i => (
                    <Tag color="processing">{i}</Tag>
                  ))}
                </Descriptions.Item>
              </Descriptions>
              <Row style={{ padding: '10px 0' }}>已有资源</Row>
              <Row>
                <Col span={6}>
                  <Statistic
                    title="CPU"
                    value={`${this.userResTotal.cpu} Core`}
                    valueStyle={{
                      color: '#333',
                      fontSize: '18px',
                    }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="内存"
                    value={`${this.userResTotal.mem} GiB`}
                    valueStyle={{
                      color: '#333',
                      fontSize: '18px',
                    }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="磁盘"
                    value={`${this.userResTotal.disk} GB`}
                    valueStyle={{
                      color: '#333',
                      fontSize: '18px',
                    }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="GPU"
                    value={`${this.userResTotal.gpu} Core`}
                    valueStyle={{
                      color: '#333',
                      fontSize: '18px',
                    }}
                  />
                </Col>
              </Row>
            </Panel>
            <Panel title="新资源申请">
              <Row style={{ paddingBottom: '10px' }}>资源信息：</Row>
              <Row>
                <Col span={6}>
                  <Statistic
                    title="CPU"
                    value={`${item.cpu} Core`}
                    valueStyle={{
                      color: '#333',
                      fontSize: '18px',
                    }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="内存"
                    value={`${item.mem} GiB`}
                    valueStyle={{
                      color: '#333',
                      fontSize: '18px',
                    }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="磁盘"
                    value={`${item.disk} GB`}
                    valueStyle={{
                      color: '#333',
                      fontSize: '18px',
                    }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="GPU"
                    value={`${item.gpu} Core`}
                    valueStyle={{
                      color: '#333',
                      fontSize: '18px',
                    }}
                  />
                </Col>
              </Row>
              <Row style={{ padding: '10px 0' }}>申请理由：</Row>
              <Row>
                <Col>{item.reason || '无申请理由'}</Col>
              </Row>
            </Panel>
            {item.status === 0 && (
              <Panel title="组织资源">
                <Row style={{ paddingBottom: '10px' }}>总资源：</Row>
                <Row>
                  <Col span={6}>
                    <Statistic
                      title="CPU"
                      value={`${this.groupResourceTotal.cpu} Core`}
                      valueStyle={{
                        color: '#333',
                        fontSize: '18px',
                      }}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="内存"
                      value={`${this.groupResourceTotal.mem.toFixed(2)} GiB`}
                      valueStyle={{
                        color: '#333',
                        fontSize: '18px',
                      }}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="磁盘"
                      value={`${this.groupResourceTotal.disk.toFixed(2)} GB`}
                      valueStyle={{
                        color: '#333',
                        fontSize: '18px',
                      }}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="GPU"
                      value={`${this.groupResourceTotal.gpu} Core`}
                      valueStyle={{
                        color: '#333',
                        fontSize: '18px',
                      }}
                    />
                  </Col>
                </Row>
                <Row style={{ padding: '10px 0' }}>已使用资源：</Row>
                <Row>
                  <Col span={6}>
                    <Statistic
                      title="CPU"
                      value={`${this.groupResourceUsedTotal.cpu_used.toFixed(
                        2
                      )} Core`}
                      valueStyle={{
                        color: '#333',
                        fontSize: '18px',
                      }}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="内存"
                      value={`${this.groupResourceUsedTotal.mem_used.toFixed(
                        2
                      )} GiB`}
                      valueStyle={{
                        color: '#333',
                        fontSize: '18px',
                      }}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="磁盘"
                      value={`${this.groupResourceUsedTotal.disk_used.toFixed(
                        2
                      )} GB`}
                      valueStyle={{
                        color: '#333',
                        fontSize: '18px',
                      }}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="GPU"
                      value={`${this.groupResourceUsedTotal.gpu_used.toFixed(
                        2
                      )} Core`}
                      valueStyle={{
                        color: '#333',
                        fontSize: '18px',
                      }}
                    />
                  </Col>
                </Row>
              </Panel>
            )}
            {item.app && (
              <Panel title="应用信息">
                <Descriptions title="" bordered>
                  <Descriptions.Item label="应用名称">
                    {this.appDetail?.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="描述">
                    {this.appDetail?.description}
                  </Descriptions.Item>
                  <Descriptions.Item label="版本">
                    {this.appDetail?.latest_app_version?.name}
                  </Descriptions.Item>
                </Descriptions>
              </Panel>
            )}
            <Panel title="审核状态">
              <Form.Item name="id" hidden>
                <Input />
              </Form.Item>
              <Form.Item label="审核状态">
                {this.renderStatus(this.props.item.status)}
              </Form.Item>
              <Form.Item label="审核理由" name="msg">
                <TextArea row={5} disabled={item.status !== 0}></TextArea>
              </Form.Item>
            </Panel>
            {item.status === 0 && (
              <Row justify="end">
                <KButton type="control" onClick={() => handleApply(1)}>
                  审批
                </KButton>
                <KButton type="danger" onClick={() => handleApply(0)}>
                  驳回
                </KButton>
                <KButton
                  type="default"
                  htmlType="button"
                  onClick={handleCancel}
                >
                  取消
                </KButton>
              </Row>
            )}
          </Form>
        </Modal>
      )
    )
  }
}
