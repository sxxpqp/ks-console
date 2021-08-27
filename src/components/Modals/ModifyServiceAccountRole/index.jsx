import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import copy from 'fast-copy'

import { Form } from '@kube-design/components'
import { Modal } from 'components/Base'
import { RoleSelect } from 'components/Inputs'

import RoleStore from 'stores/role'

@observer
export default class ModifyModal extends React.Component {
  static propTypes = {
    detail: PropTypes.object,
    title: PropTypes.string,
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    isSubmitting: PropTypes.bool,
  }

  static defaultProps = {
    visible: false,
    isSubmitting: false,
    onOk() {},
    onCancel() {},
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
    this.props.onOk(data)
  }

  render() {
    const {
      title,
      visible,
      onCancel,
      isSubmitting,
      cluster,
      namespace,
    } = this.props
    const { formData } = this.state

    return (
      <Modal.Form
        width={600}
        title={title || t('Modify Service Account Role')}
        icon="client"
        data={formData}
        onOk={this.handleOk}
        onCancel={onCancel}
        visible={visible}
        isSubmitting={isSubmitting}
      >
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
