import React from 'react'
import PropTypes from 'prop-types'
import { isUndefined } from 'lodash'
import { Modal } from 'components/Base'
import EditMode from 'components/EditMode'

export default class AddByYamlModal extends React.Component {
  static propTypes = {
    detail: PropTypes.object,
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    isSubmitting: PropTypes.bool,
    readOnly: PropTypes.bool,
  }

  static defaultProps = {
    visible: false,
    isSubmitting: false,
    readOnly: false,
    detail: {},
    onOk() {},
    onCancel() {},
  }

  constructor(props) {
    super(props)

    this.state = {
      value: {
        kind: 'NetworkPolicy',
        apiVersion: 'networking.k8s.io/v1',
        metadata: {
          name: '',
          namespace: '',
        },
        spec: {
          podSelector: {},
        },
      },
    }

    this.editor = React.createRef()
  }

  handleOk = () => {
    const { onOk, onCancel } = this.props

    const value = this.editor.current.getData()
    if (isUndefined(value)) {
      onCancel()
    } else {
      onOk(value)
    }
  }

  render() {
    const { visible, onCancel, isSubmitting } = this.props

    return (
      <Modal
        icon="firewall"
        title={t('Create Network Policy')}
        description={t('NETWORK_POLICY_CREATE_DESC')}
        onOk={this.handleOk}
        onCancel={onCancel}
        okText={t('OK')}
        visible={visible}
        isSubmitting={isSubmitting}
        width={960}
      >
        <EditMode ref={this.editor} value={this.state.value} />
      </Modal>
    )
  }
}
