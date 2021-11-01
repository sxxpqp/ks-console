import React from 'react'
import PropTypes from 'prop-types'

import { Form, Input, TextArea } from '@kube-design/components'
import { Modal } from 'components/Base'

export default class AppEditModal extends React.Component {
  static propTypes = {
    detail: PropTypes.object,
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    isSubmitting: PropTypes.bool,
  }

  static defaultProps = {
    visible: false,
    onOk() {},
    onCancel() {},
    isSubmitting: false,
  }

  handleOk = data => {
    const { onOk } = this.props

    onOk(data)
  }

  render() {
    const { detail, visible, isSubmitting, onCancel } = this.props

    return (
      <Modal.Form
        data={detail}
        width={691}
        title={t('Edit Info')}
        icon="pen"
        onOk={this.handleOk}
        okText={t('Update')}
        onCancel={onCancel}
        visible={visible}
        isSubmitting={isSubmitting}
      >
        <Form.Item
          label={t('Name')}
          desc={'支持中英文名称，最长63个字符，汉字&字母打头'}
        >
          <TextArea maxLength={16} name="description" />
        </Form.Item>
        <Form.Item
          label={'ID'}
          desc={'唯一标识，也是网络访问标识，可用于标定集群节点之间的关系。'}
        >
          <Input name="name" disabled />
        </Form.Item>
      </Modal.Form>
    )
  }
}
