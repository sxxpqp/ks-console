import React from 'react'
import { Modal } from 'components/Base'
import { Form, Input, TextArea } from '@kube-design/components'

export default class AddNodeTypeModal extends React.Component {
  render() {
    return (
      <Modal.Form
        width={600}
        icon="nodes"
        title={t('Add Node Type')}
        {...this.props}
      >
        <Form.Item label={t('Type Name')} desc={t('NAME_DESC')}>
          <Input name="name" maxLength={63} />
        </Form.Item>
        <Form.Item
          label={t('Description')}
          desc={t('NODE_TYPE_DESCRIPTION_DEC')}
        >
          <TextArea name="description" />
        </Form.Item>
      </Modal.Form>
    )
  }
}
