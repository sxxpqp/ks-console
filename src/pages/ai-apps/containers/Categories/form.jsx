import React, { Component } from 'react'
import { Modal, Form, Input, Row, Select } from 'antd'
import { Button as KButton } from '@kube-design/components'
import { observer } from 'mobx-react'
import styles from './index.scss'
// const { TreeNode } = TreeSelect

const { Option } = Select

@observer
export default class EditModal extends Component {
  constructor(props) {
    super(props)
    this.form = React.createRef()
    this.state = {
      tags: [],
    }
  }

  componentDidUpdate() {
    const { item } = this.props
    if (this.form.current) {
      this.form.current.setFieldsValue({
        ...item,
        tagId:
          (item && item.app_labels && item.app_labels.map(i => i.tagId)) || [],
      })
    }
  }

  render() {
    const { show, onSubmit, onCancel, lists, isBatch } = this.props

    const getNewList = () => {
      return lists.filter(i => i.id !== -1)
    }

    // const { tags } = this.state

    const handleCancel = () => {
      this.form.current.resetFields()
      onCancel && onCancel()
      this.setState({ chooseIcon: '' })
    }

    const handleSubmit = () => {
      this.form.current.validateFields().then(values => {
        onSubmit && onSubmit({ ...values })
        handleCancel()
      })
    }

    // const handleChange = value => {
    //   console.log(
    //     '🚀 ~ file: form.jsx ~ line 48 ~ EditModal ~ handleChange ~ value',
    //     value
    //   )
    // }

    // const onChange = e => {
    //   console.log('🚀 ~ file: form.jsx ~ line 29 ~ GroupsForm ~ render ~ e', e)
    // }

    return (
      <Modal
        title={'编辑标签'}
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
          {!isBatch && (
            <Form.Item label="应用名称" name="name">
              <Input disabled />
            </Form.Item>
          )}
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
