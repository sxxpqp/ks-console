/* eslint-disable no-console */
import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { Input, Form, TextArea, Select } from '@kube-design/components'
import classnames from 'classnames'
import ChooseIconModal from 'components/Modals/ChooseIcons'
import { Modal } from 'components/Base'

// import { PATTERN_NAME } from 'utils/constants'
import { TreeSelect, Input as AInput } from 'antd'
import styles from './index.scss'

@observer
export default class MenuCreate extends React.Component {
  static propTypes = {
    // store: PropTypes.object,
    // module: PropTypes.string,
    // roleTemplates: PropTypes.array,
    // formTemplate: PropTypes.object,
    title: PropTypes.string,
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    isSubmitting: PropTypes.bool,
  }

  static defaultProps = {
    visible: false,
    isSubmitting: false,
    module: 'roles',
    onOk() {},
    onCancel() {},
  }

  state = {
    value: [],
    type: -1,
    icon: '',
  }

  roleNameValidator = (rule, value, callback) => {
    return callback()
  }

  getMenuType() {
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
        label: '链接',
        value: 2,
      },
    ]
  }

  renderIcons() {
    const handleIcons = () => {
      const modal = Modal.open({
        onOk: async data => {
          this.setState({
            icon: data,
          })
          Modal.close(modal)
        },
        title: '选择图标',
        modal: ChooseIconModal,
      })
    }
    return <div onClick={() => handleIcons()}>选择图标</div>
  }

  render() {
    const {
      title,
      visible,
      onCancel,
      onOk,
      formTemplate,
      treeData,
    } = this.props

    const { type, icon } = this.state

    const formRef = React.createRef()
    const handleOk = data => {
      // console.log(formRef)
      onOk({
        ...data,
        type: type !== -1 ? type : formTemplate.type,
        icon: icon || formTemplate.icon,
      })
    }

    const types = [
      {
        label: '菜单',
        value: 0,
      },
      {
        label: '目录',
        value: 1,
      },
      {
        label: '链接',
        value: 2,
      },
    ]

    const selectChange = value => {
      // 获取最新的select的值
      this.setState({
        type: value,
      })
    }

    return (
      <Modal.Form
        width={600}
        title={title}
        icon="role"
        data={formTemplate}
        onCancel={onCancel}
        onOk={handleOk}
        okText={'确定'}
        visible={visible}
        ref={formRef}
      >
        <Form.Item label={t('Name')} name="name">
          <Input name="name" maxLength={63} />
        </Form.Item>
        <Form.Item label="菜单类型" name="type">
          <div>
            <Select
              defaultValue={formTemplate.type}
              name="type"
              options={types}
              onChange={selectChange}
            />
          </div>
        </Form.Item>
        <Form.Item label="父级菜单" name="pid">
          <TreeSelect
            allowClear
            name="pid"
            className={styles['max-width']}
            value={this.state.value}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData}
            placeholder="选择父级菜单（留空为一级菜单）"
            treeDefaultExpandAll
            onChange={this.onChange}
          />
        </Form.Item>
        <Form.Item label="菜单地址" name="path">
          <Input name="path" maxLength={255} />
        </Form.Item>
        <Form.Item label="菜单路由" name="route">
          <Input name="route" maxLength={255} />
        </Form.Item>
        <Form.Item label="排序">
          <Input name="sort" defaultValue={50} maxLength={255} />
        </Form.Item>
        <Form.Item label="菜单图标" name="icon">
          <div>
            <AInput
              className={classnames(styles['max-width'])}
              addonAfter={this.renderIcons()}
              name="icon"
              value={icon || formTemplate.icon}
            />
          </div>
        </Form.Item>
        <Form.Item label="备注" desc={t('DESCRIPTION_DESC')} name="remark">
          <TextArea name="remark" maxLength={256} />
        </Form.Item>
        {/* <Alert
          className="margin-t12"
          title={t('ROLE_CREATE_TIP_TITLE')}
          message={t('ROLE_CREATE_TIP_MESSAGE')}
        /> */}
      </Modal.Form>
    )
  }
}
