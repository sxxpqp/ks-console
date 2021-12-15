import React, { Component } from 'react'
import { Modal, Form, Input, Row, Select, TreeSelect } from 'antd'
import { Button as KButton } from '@kube-design/components'
import { observer } from 'mobx-react'
import { generateId } from 'utils'
import styles from './index.scss'

const { Option } = Select
// const { TreeNode } = TreeSelect

@observer
export default class GroupsForm extends Component {
  constructor(props) {
    super(props)
    this.form = React.createRef()
  }

  componentDidUpdate() {
    const { item, isEdit } = this.props
    if (this.form.current) {
      if (!isEdit) {
        this.form.current.setFieldsValue({
          name: '',
          pid: item.id || -1,
          type: 1,
          code: generateId(),
        })
      } else {
        this.form.current.setFieldsValue(item)
      }
    }
  }

  render() {
    const { isEdit, show, onSubmit, onCancel, treeData } = this.props

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

    const getNewData = () => {
      return [
        {
          key: '-1',
          id: -1,
          name: '无',
        },
        ...treeData,
      ]
    }

    // const onChange = e => {
    //   console.log('🚀 ~ file: form.jsx ~ line 29 ~ GroupsForm ~ render ~ e', e)
    // }

    return (
      <Modal
        title={isEdit ? '编辑组织' : '创建组织'}
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
            label="组织名称"
            name="name"
            rules={[{ required: true, message: '请输入组织名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="组织别名" name="desc">
            <Input />
          </Form.Item>

          <Form.Item
            label="组织编码"
            name="code"
            hidden
            // rules={[{ required: true, message: '请输入组织编码' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="上级部门" name="pid">
            <TreeSelect
              key="id"
              treeLine={{ showLeafIcon: false }}
              // showSearch
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择上级部门"
              allowClear
              treeDefaultExpandAll
              // initialValues={-1}
              // onChange={onChange}
              fieldNames={{ label: 'name', value: 'id', key: 'id' }}
              treeData={getNewData()}
            >
              {/* <TreeNode value="-1" title="无"></TreeNode> */}
            </TreeSelect>
          </Form.Item>
          <Form.Item label="类型" name="type">
            <Select bordered>
              <Option value={1}>部门</Option>
              <Option value={0}>组织&企业</Option>
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
