import React from 'react'
import PropTypes from 'prop-types'

import { PATTERN_NAME } from 'utils/constants'
import { Form, Input } from '@kube-design/components'
import { Modal } from 'components/Base'

export default class ResourceNamed extends React.Component {
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

  render() {
    const { visible, isSubmitting, onCancel, onOk, title } = this.props

    return (
      <Modal.Form
        icon="pen"
        width={691}
        title={title}
        onOk={onOk}
        onCancel={onCancel}
        visible={visible}
        isSubmitting={isSubmitting}
      >
        <Form.Item
          label={t('Name')}
          rules={[
            { required: true, message: t('Please input name') },
            {
              pattern: PATTERN_NAME,
              message: t('Invalid name', { message: t('LONG_NAME_DESC') }),
            },
          ]}
          desc={t('LONG_NAME_DESC')}
        >
          <Input name="name" maxLength={253} />
        </Form.Item>
      </Modal.Form>
    )
  }
}
