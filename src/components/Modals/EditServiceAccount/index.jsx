import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import copy from 'fast-copy'

import { Form, Input, TextArea } from '@kube-design/components'
import { Modal } from 'components/Base'
import { RoleSelect } from 'components/Inputs'

import RoleStore from 'stores/role'

@observer
export default class EditServiceAccountModal extends React.Component {
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

  roleStore = new RoleStore()

  constructor(props) {
    super(props)

    this.state = {
      formData: copy(props.detail),
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible && this.props.visible !== prevProps.visible) {
      this.setState({ formData: copy(this.props.detail) })
    }
  }

  handleOk = data => {
    const { onOk } = this.props
    onOk(data)
  }

  render() {
    const { visible, isSubmitting, onCancel, cluster, namespace } = this.props
    const { formData } = this.state

    return (
      <Modal.Form
        data={formData}
        width={691}
        title={t('Edit Info')}
        icon="pen"
        onOk={this.handleOk}
        okText={t('Update')}
        onCancel={onCancel}
        visible={visible}
        isSubmitting={isSubmitting}
      >
        <Form.Item label={t('Name')}>
          <Input name="metadata.name" disabled />
        </Form.Item>
        <Form.Item label={t('Alias')} desc={t('ALIAS_DESC')}>
          <Input
            name="metadata.annotations['kubesphere.io/alias-name']"
            maxLength={63}
          />
        </Form.Item>
        <Form.Item label={t('Description')} desc={t('DESCRIPTION_DESC')}>
          <TextArea
            name="metadata.annotations['kubesphere.io/description']"
            maxLength={256}
          />
        </Form.Item>
        <Form.Item label={t('Project Role')} desc={t('PROJECT_ROLE_DESC')}>
          <RoleSelect
            name="metadata.annotations['iam.kubesphere.io/role']"
            cluster={cluster}
            namespace={namespace}
          />
        </Form.Item>
      </Modal.Form>
    )
  }
}
