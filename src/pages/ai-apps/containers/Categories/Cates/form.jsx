import React, { Component } from 'react'
import { Modal, Form, Input, Row } from 'antd'
import { Button as KButton, Icon } from '@kube-design/components'
import { observer } from 'mobx-react'
import { CATEGORY_ICONS } from 'configs/openpitrix/app'
import classnames from 'classnames'
import styles from './index.scss'
// const { TreeNode } = TreeSelect

@observer
export default class CateFormModal extends Component {
  constructor(props) {
    super(props)
    this.form = React.createRef()
    this.state = {
      chooseIcon: this.props.item ? this.props.item.icon : '',
    }
  }

  componentDidUpdate() {
    const { item, isEdit } = this.props
    if (this.form.current) {
      if (isEdit) {
        this.form.current.setFieldsValue(item)
      }
    }
  }

  changeIcon = icon => {
    this.setState({ chooseIcon: icon })
  }

  render() {
    const { isEdit, show, onSubmit, onCancel } = this.props
    const { chooseIcon } = this.state

    const handleCancel = () => {
      this.form.current.resetFields()
      onCancel && onCancel()
      this.setState({ chooseIcon: '' })
    }

    const handleSubmit = () => {
      this.form.current.validateFields().then(values => {
        onSubmit && onSubmit({ ...values, icon: chooseIcon })
        handleCancel()
      })
    }

    // const onChange = e => {
    //   console.log('🚀 ~ file: form.jsx ~ line 29 ~ GroupsForm ~ render ~ e', e)
    // }

    return (
      <Modal
        title={isEdit ? '编辑标签' : '创建标签'}
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
            label="标签名称"
            name="name"
            rules={[{ required: true, message: '请输入组织名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="图标">
            <div name="description" className={styles.icons} value={chooseIcon}>
              {CATEGORY_ICONS.map(icon => (
                <label
                  key={icon}
                  onClick={() => this.changeIcon(icon)}
                  className={classnames({
                    [styles.active]: icon === chooseIcon,
                  })}
                >
                  <Icon name={icon} size={20} />
                </label>
              ))}
            </div>
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
