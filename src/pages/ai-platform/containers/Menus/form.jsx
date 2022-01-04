import React, { Component } from 'react'
import { Modal, Form, Input, Row, Select, TreeSelect, Radio } from 'antd'
import { Button as KButton } from '@kube-design/components'
import { observer } from 'mobx-react'
// import { generateId } from 'utils'
import ChooseIconModal from 'components/Modals/ChooseIconsAntd'
import { Modal as KModal } from 'components/Base'
import styles from './index.scss'

const { Option } = Select
// const { TreeNode } = TreeSelect

@observer
export default class MenuForm extends Component {
  constructor(props) {
    super(props)
    this.form = React.createRef()
    this.state = {
      name: '',
      pid: '',
    }
  }

  componentDidUpdate() {
    const { item, isEdit } = this.props
    if (this.form.current) {
      if (isEdit) {
        this.form.current.setFieldsValue(item)
      } else {
        this.form.current.setFieldsValue({
          sort: 50,
          type: 0,
          status: 1,
        })
      }
    }
  }

  get menuType() {
    return [
      {
        label: '菜单',
        value: 0,
      },
      {
        label: '目录',
        value: 1,
      },
      {
        label: '标签页',
        value: 2,
      },
      {
        label: '链接',
        value: 3,
      },
    ]
  }

  // get rootIds() {
  //   return this.props.treeData.map(item => item.id)
  // }

  // renderIcons() {
  //   const handleIcons = () => {
  //     const modal = Modal.open({
  //       onOk: async data => {
  //         this.setState({
  //           icon: data,
  //         })
  //         Modal.close(modal)
  //       },
  //       title: '选择图标',
  //       modal: ChooseIconModal,
  //     })
  //   }
  //   return <div onClick={() => handleIcons()}>选择图标</div>
  // }

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

    const chooseIcon = () => {
      const modal = KModal.open({
        onOk: async data => {
          // this.setState({
          //   icon: data,
          // })
          this.form.current &&
            this.form.current.setFieldsValue({
              icon: data,
            })
          KModal.close(modal)
        },
        title: '选择图标',
        modal: ChooseIconModal,
      })
    }

    // 选择父级菜单
    // const onChange = val => {
    //   this.setState({
    //     pid: val,
    //   })
    // }

    return (
      <Modal
        title={isEdit ? '编辑菜单' : '创建菜单'}
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
            label="菜单名称"
            name="name"
            rules={[
              { required: true, message: '请输入菜单名称' },
              { max: 16, message: '菜单名称不能超过16个字符' },
            ]}
          >
            <Input maxLength={16} />
          </Form.Item>
          <Form.Item
            label="菜单类型"
            name="type"
            rules={[{ required: true, message: '请选择菜单类型' }]}
          >
            <Select bordered placeholder="请选择菜单类型">
              {this.menuType.map(item => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="父级菜单" name="pid">
            <TreeSelect
              key="id"
              treeLine={{ showLeafIcon: false }}
              // showSearch
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择上级菜单，默认空为根级菜单"
              allowClear
              treeDefaultExpandAll
              // initialValues={-1}
              // onChange={onChange}
              fieldNames={{ label: 'name', value: 'id', key: 'id' }}
              treeData={treeData}
            ></TreeSelect>
          </Form.Item>
          <Form.Item
            label="路径"
            name="path"
            rules={[
              { required: true, message: '请输入路径' },
              { max: 128, message: '路径最长不能超过128个字符' },
            ]}
          >
            <Input placeholder="请输入路径" maxLength={128} />
          </Form.Item>
          <Form.Item
            label="菜单路由"
            name="route"
            rules={[
              { required: true, message: '请输入菜单路由，用于激活显示' },
            ]}
          >
            <Input type="text" placeholder="请输入菜单路由" />
          </Form.Item>
          <Form.Item label="排序" name="sort">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="是否启用" name="status">
            <Radio.Group>
              <Radio value={1}>启用</Radio>
              <Radio value={0}>禁用</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="菜单图标" name="icon">
            <Input
              type="text"
              addonAfter={<span onClick={chooseIcon}>选择图标</span>}
            />
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
