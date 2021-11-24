import React, { Component } from 'react'
import { Modal, Form, Input, Row, Select, TreeSelect } from 'antd'
import { Button as KButton } from '@kube-design/components'
import { observer } from 'mobx-react'
import { generateId } from 'utils'
import { get } from 'lodash'
import styles from './index.scss'

const { Option } = Select
// const { TreeNode } = TreeSelect

@observer
export default class MembersForm extends Component {
  constructor(props) {
    super(props)
    this.form = React.createRef()
    this.state = {
      dirt: false,
    }
  }

  componentDidUpdate() {
    const { item, isEdit, group } = this.props
    if (this.form.current) {
      if (!isEdit) {
        this.form.current.setFieldsValue({
          username: '',
          name: '',
          role: [],
          email: '',
          mobile: '',
          pid: group?.id || '',
          password: generateId(8).replace(/^\S/, s => s.toUpperCase()),
        })
      } else {
        const pid = get(item, 'users_groups[0].gid')
        const role = get(item, 'users_roles').map(i => i.roleId)
        this.form.current.setFieldsValue({ ...item, pid, role, password: '' })
      }
    }
  }

  render() {
    const { isEdit, show, onSubmit, onCancel, treeData } = this.props
    const { dirt } = this.state

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

    const createNewPass = () => {
      this.setState({ dirt: true })
      const values = this.form.current.getFieldsValue()
      this.form.current.setFieldsValue({
        ...values,
        password: generateId(8).replace(/^\S/, s => s.toUpperCase()),
      })
    }

    // const onChange = e => {
    //   console.log('🚀 ~ file: form.jsx ~ line 29 ~ GroupsForm ~ render ~ e', e)
    // }

    return (
      <Modal
        title={isEdit ? '编辑用户' : '创建用户'}
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
            label="用户名称"
            name="name"
            rules={[
              { required: true, message: '请输入用户名称' },
              { max: 16, message: '名称不得超过16个字符' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="登录账号"
            name="username"
            rules={[{ required: true, message: '请输入登录账号' }]}
          >
            <Input disabled={isEdit} />
          </Form.Item>
          {isEdit ? (
            <Form.Item label="初始密码" name="password">
              <Input
                disabled={isEdit && !dirt}
                style={{ flex: 1, marginRight: '15px' }}
                addonAfter={<span onClick={createNewPass}>重置密码</span>}
              />
            </Form.Item>
          ) : (
            <Form.Item
              label="初始密码"
              name="password"
              rules={[{ required: true, message: '请输入初始密码' }]}
            >
              <Input />
            </Form.Item>
          )}
          <Form.Item
            label="手机号"
            name="mobile"
            rules={[
              { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              {
                type: 'email',
                message: '输入的不是有效的邮箱!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="上级部门"
            name="pid"
            rules={[{ required: true, message: '请选择上级部门' }]}
          >
            <TreeSelect
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
              treeData={treeData}
            >
              {/* <TreeNode value="-1" title="无"></TreeNode> */}
            </TreeSelect>
          </Form.Item>
          <Form.Item
            label="角色"
            name="role"
            rules={[{ required: true, message: '请设置用户角色' }]}
          >
            <Select bordered mode="multiple" allowClear>
              {this.props.roleData.map(i => (
                <Option value={i.id}>{i.desc}</Option>
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
