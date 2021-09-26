/* eslint-disable no-console */
import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { Input, Form, TextArea, Select } from '@kube-design/components'
import classnames from 'classnames'

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
  }

  // handleCreate = roleTemplates => {
  //   set(
  //     this.props.formTemplate,
  //     'metadata.annotations["iam.kubesphere.io/aggregation-roles"]',
  //     JSON.stringify(roleTemplates)
  //   )
  //   this.props.onOk(this.props.formTemplate)
  // }

  roleNameValidator = (rule, value, callback) => {
    return callback()
  }

  // roleNameValidator = (rule, value, callback) => {
  //   if (!value) {
  //     return callback()
  //   }

  //   const { workspace, cluster, namespace } = this.props
  //   const name = get(this.props.formTemplate, 'metadata.name')

  //   if (this.props.edit && name === value) {
  //     return callback()
  //   }

  //   this.props.store
  //     .checkName({ name: value, workspace, cluster, namespace })
  //     .then(resp => {
  //       if (resp.exist) {
  //         return callback({ message: t('Role name exists'), field: rule.field })
  //       }
  //       callback()
  //     })
  // }

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

  onChange = value => {
    console.log(value)
    // this.setState({ value })
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
    console.log(
      '🚀 ~ file: index.jsx ~ line 108 ~ MenuCreate ~ render ~ treeData',
      treeData
    )

    // if (showEditAuthorization) {
    //   return (
    //     <EditAuthorization
    //       module={module}
    //       visible={showEditAuthorization}
    //       formTemplate={formTemplate}
    //       roleTemplates={roleTemplates}
    //       onOk={this.handleCreate}
    //       onCancel={this.hideEditAuthorization}
    //       isSubmitting={isSubmitting}
    //     />
    //   )
    // }

    const defaultValue = formTemplate.type || 0

    return (
      <Modal.Form
        width={600}
        title={title}
        icon="role"
        data={formTemplate}
        onCancel={onCancel}
        onOk={onOk}
        okText={'确定'}
        visible={visible}
      >
        <Form.Item label={t('Name')} name="name">
          <Input name="name" maxLength={63} />
        </Form.Item>
        <Form.Item label="菜单类型" name="type">
          <Select
            defaultValue={defaultValue}
            name="type"
            options={this.getMenuType()}
          />
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
          <AInput
            className={classnames(styles['max-width'])}
            addonAfter={<div>选择图标</div>}
            defaultValue=""
            name="icon"
          />
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
