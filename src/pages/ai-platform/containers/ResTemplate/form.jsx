import React, { Component } from 'react'
import { Modal, Form, Input, Row, Select } from 'antd'
import { Button as KButton } from '@kube-design/components'
import { observer } from 'mobx-react'
import styles from './index.scss'

const { Option } = Select
const { TextArea } = Input

@observer
export default class ResTemplateForm extends Component {
  constructor(props) {
    super(props)
    this.form = React.createRef()
    this.state = {
      cpuOptions: [
        1,
        2,
        4,
        8,
        12,
        16,
        20,
        24,
        32,
        40,
        48,
        52,
        64,
        72,
        80,
        96,
        104,
        208,
      ],
      memOptions: [
        1,
        2,
        4,
        8,
        16,
        24,
        32,
        48,
        64,
        88,
        96,
        128,
        176,
        192,
        256,
        288,
        352,
        384,
        512,
        768,
        1536,
        3072,
      ],
      gpuOptions: [0, 1, 2, 4, 8, 12, 16, 20, 24, 32],
    }
  }

  // componentWillUmount() {
  //   this.form.current.resetFields()
  // }

  componentDidUpdate() {
    const { item, isEdit } = this.props
    if (this.form.current && isEdit && item) {
      this.form.current.setFieldsValue(item)
    } else {
      this.form.current && this.form.current.resetFields()
    }
  }

  render() {
    const { isEdit, show, onSubmit, onCancel } = this.props
    const { cpuOptions, memOptions, gpuOptions } = this.state

    const handleCancel = () => {
      this.form.current.resetFields()
      onCancel && onCancel()
    }

    const handleSubmit = () => {
      this.form.current.validateFields().then(values => {
        onSubmit && onSubmit(values)
        this.form.current.resetFields()
      })
    }

    return (
      <Modal
        title={isEdit ? '编辑模板' : '创建模板'}
        centered
        visible={show}
        footer={null}
        // okText="确定"
        // cancelText="取消"
        // onOk={() => this.handleModal(false)}
        onCancel={handleCancel}
        className={styles.modal}
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
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            label="名称"
            name="name"
            rules={[{ required: true, message: '请输入模板名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="描述"
            name="desc"
            rules={[{ required: true, message: '请输入描述' }]}
          >
            <TextArea row={4} allowClear />
          </Form.Item>

          <Form.Item
            label="CPU"
            name="cpu"
            rules={[{ required: true, message: '请选择需要的CPU资源' }]}
          >
            <Select placeholder="选择 vCPU" allowClear>
              {cpuOptions.map(item => {
                return (
                  <Option value={item} key={item}>
                    {item} vCore
                  </Option>
                )
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="内存"
            name="mem"
            rules={[{ required: true, message: '请选择需要的内存资源' }]}
          >
            <Select placeholder="选择内存" allowClear>
              {memOptions.map(item => {
                return (
                  <Option value={item} key={item}>
                    {item} GiB
                  </Option>
                )
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="磁盘"
            name="disk"
            rules={[{ required: true, message: '请选择需要的磁盘资源' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="GPU" name="gpu">
            <Select placeholder="选择GPU" allowClear>
              {gpuOptions.map(item => {
                return (
                  <Option key={item} value={item}>
                    {item > 0 ? `${item}vCore` : '不需要'}
                  </Option>
                )
              })}
            </Select>
          </Form.Item>
          <Row justify="end">
            <KButton type="control" onClick={handleSubmit}>
              确定
            </KButton>
            <KButton type="default" htmlType="button" onClick={handleCancel}>
              取消
            </KButton>
          </Row>
        </Form>
      </Modal>
    )
  }
}
