import React, { Component } from 'react'
import { Modal, Form, Input, Row, TreeSelect } from 'antd'
import { observer } from 'mobx-react'
import { Button as KButton } from '@kube-design/components'
import styles from './index.scss'

@observer
export default class EditModal extends Component {
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

  render() {
    const { show, item, onSubmit, onCancel, treeData } = this.props

    const handleCancel = () => {
      this.form.current.resetFields()
      onCancel && onCancel()
    }

    const handleSubmit = () => {
      this.form.current.validateFields().then(values => {
        onSubmit && onSubmit(values)
        handleCancel()
      })
    }

    return (
      <Modal
        title={'编辑节点信息'}
        centered
        visible={show}
        footer={null}
        // okText="确定"
        // cancelText="取消"
        // onOk={() => this.handleModal(false)}
        onCancel={handleCancel}
        className={styles.modal}
      >
        {item && (
          <Form
            name="form"
            ref={this.form}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            autoComplete="off"
            className="margin-b12"
          >
            <Form.Item name="name" label="名称">
              <Input
                placeholder="请输入节点名称，最长16个字符"
                maxLength={16}
                allowClear
              ></Input>
            </Form.Item>
            <Form.Item name="gid" label="组织">
              <TreeSelect
                showSearch
                style={{
                  width: '100%',
                  border: '1px solid #d9d9d9',
                  borderRadius: '2px',
                }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                allowClear
                treeDefaultExpandAll
                // initialValues={-1}
                // onChange={onChange}
                placeholder="请选择组织"
                fieldNames={{ label: 'name', value: 'id', key: 'id' }}
                treeData={treeData}
              />
            </Form.Item>
            <Form.Item hidden name="machine">
              <Input></Input>
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
        )}
      </Modal>
    )
  }
}
