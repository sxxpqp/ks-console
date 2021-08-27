import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'components/Base'
import ExternalName from 'components/Forms/Service/ExternalName'

import { SERVICE_TYPES } from 'utils/constants'
import ServiceSettings from './Form'

import styles from './index.scss'

export default class ServiceSettingModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    type: PropTypes.string,
    detail: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    isSubmitting: PropTypes.bool,
  }

  static defaultProps = {
    visible: false,
    type: '',
    detail: {},
    onOk() {},
    onCancel() {},
    isSubmitting: false,
  }

  constructor(props) {
    super(props)

    this.formRef = React.createRef()

    this.state = { formTemplate: props.detail }
  }

  componentDidUpdate(prevProps) {
    const { detail } = this.props

    if (detail._originData !== prevProps.detail._originData) {
      this.setState({
        formTemplate: detail,
      })
    }
  }

  handleOk = () => {
    const { onOk } = this.props
    const form = this.formRef.current

    form &&
      form.validate(() => {
        onOk(form.getData())
      })
  }

  handleCancel = () => {
    const { onCancel } = this.props

    onCancel()
  }

  renderServiceSettings() {
    const { cluster } = this.props
    return (
      <ServiceSettings
        formRef={this.formRef}
        formTemplate={this.state.formTemplate}
        onCancel={this.resetState}
        cluster={cluster}
      />
    )
  }

  renderExternalName() {
    return (
      <ExternalName
        formRef={this.formRef}
        formTemplate={this.state.formTemplate}
        onCancel={this.resetState}
      />
    )
  }

  renderEmpty() {
    return <p className={styles.empty}>{t('Unknown service type')}</p>
  }

  renderForm() {
    const { type } = this.props

    let content = null

    switch (type) {
      case SERVICE_TYPES.VirtualIP:
      case SERVICE_TYPES.Headless:
        content = this.renderServiceSettings()
        break
      case SERVICE_TYPES.ExternalName:
        content = this.renderExternalName()
        break
      default:
        content = this.renderEmpty()
    }

    return content
  }

  render() {
    const { visible, isSubmitting, type } = this.props

    return (
      <Modal
        width={1162}
        title={t('Edit Service')}
        onOk={type !== SERVICE_TYPES.Unknown ? this.handleOk : null}
        onCancel={this.handleCancel}
        visible={visible}
        isSubmitting={isSubmitting}
      >
        {this.renderForm()}
      </Modal>
    )
  }
}
