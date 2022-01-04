import React, { Component } from 'react'
import { Modal, Form, Input, Row, Select } from 'antd'
import { Button as KButton } from '@kube-design/components'
import { observer } from 'mobx-react'
import styles from './index.scss'

const { Option } = Select
// const { TreeNode } = TreeSelect

@observer
export default class EditAppForm extends Component {
  constructor(props) {
    super(props)
    this.form = React.createRef()
  }

  componentDidUpdate() {
    const { item } = this.props
    if (this.form.current) {
      const tagId = item.app_labels.map(i => i.tagId)
      this.form.current.setFieldsValue({ ...item, tagId })
    }
  }

  render() {
    const { show, onSubmit, onCancel, lists } = this.props

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

    // const onChange = e => {
    //   console.log('🚀 ~ file: form.jsx ~ line 29 ~ GroupsForm ~ render ~ e', e)
    // }
    const getNewList = () => {
      return lists.filter(i => i.id !== -1)
    }

    return (
      <Modal
        title={'编辑应用'}
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
          <Form.Item name="appId" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            label="名称"
            name="name"
            rules={[
              { required: true, message: '请输入名称' },
              {
                pattern: /^[\u4e00-\u9fa5_a-zA-Z].*$/,
                message: '必须使用中文或者字母打头',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="标签" name="tagId">
            <Select
              mode="multiple"
              allowClear
              style={{
                width: '100%',
                borderRadius: '2px',
                border: '1px solid #d9d9d9',
              }}
              listItemHeight={10}
              listHeight={250}
              placeholder="请选择标签"
              // onChange={handleChange}
            >
              {getNewList().map(i => (
                <Option key={i.id} value={i.id}>
                  {i.name}
                </Option>
              ))}
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
