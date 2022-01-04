import React, { Component } from 'react'
import { Modal, Form, Input, Row, Col, Tag, Statistic } from 'antd'
import { Button as KButton } from '@kube-design/components'
import { Panel } from 'components/Base'
import styles from './index.scss'
// const { TextArea } = Input
export default class Detail extends Component {
  constructor(props) {
    super(props)
    this.form = React.createRef()
  }

  componentDidUpdate() {
    const { item } = this.props
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

  render() {
    const { show, item, onCancel } = this.props
    const handleCancel = () => {
      this.form.current.resetFields()
      onCancel && onCancel()
    }

    return (
      item && (
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
          width={600}
        >
          <Form
            // name="form"
            ref={this.form}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            // onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            // initialValues={isEdit ? item : { pid: item.pid || -1, type: 1 }}
            autoComplete="off"
            className="margin-b12"
          >
            <Panel title="审核状态">
              <Form.Item name="id" hidden>
                <Input />
              </Form.Item>
              <Form.Item label="审核状态" name="name">
                {this.renderStatus(this.props.item.status)}
              </Form.Item>
              <Form.Item label="审核理由" name="desc">
                {this.props.item.msg || '(空)'}
              </Form.Item>
            </Panel>
            <Panel title="资源申请">
              <Row>
                <Col span={6}>
                  <Statistic
                    title="CPU"
                    value={`${item.cpu} Core`}
                    valueStyle={{ color: '#333' }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="内存"
                    value={`${item.mem} GiB`}
                    valueStyle={{ color: '#333' }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="磁盘"
                    value={`${item.disk} GB`}
                    valueStyle={{ color: '#333' }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="GPU"
                    value={`${item.gpu} Core`}
                    valueStyle={{ color: '#333' }}
                  />
                </Col>
              </Row>
            </Panel>
            <Row justify="end">
              <KButton type="control" onClick={handleCancel}>
                确定
              </KButton>
              {/* <KButton type="default" htmlType="button" onClick={handleCancel}>
                取消
              </KButton> */}
            </Row>
          </Form>
        </Modal>
      )
    )
  }
}
