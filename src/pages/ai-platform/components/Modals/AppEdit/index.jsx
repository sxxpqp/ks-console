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
        <Form.Item label={t('Name')} desc={t('LONG_NAME_DESC')}>
          <Input name="name" disabled />
        </Form.Item>
        <Form.Item label={t('Description')} desc={t('DESCRIPTION_DESC')}>
          <TextArea maxLength={256} name="description" />
        </Form.Item>
      </Modal.Form>
    )
  }
}
