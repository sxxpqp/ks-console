import React from 'react'
import PropTypes from 'prop-types'
import { toJS } from 'mobx'
import { set } from 'lodash'

import { SERVICE_TYPES } from 'utils/constants'
import ServiceStore from 'stores/service'

import { Loading } from '@kube-design/components'
import { Modal } from 'components/Base'
import ServiceForm from './Form'

export default class StatefulSetServiceEditModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    detail: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    isSubmitting: PropTypes.bool,
  }

  static defaultProps = {
    visible: false,
    detail: {},
    onOk() {},
    onCancel() {},
    isSubmitting: false,
  }

  constructor(props) {
    super(props)

    this.formRef = React.createRef()

    this.state = { formTemplate: {} }

    this.store = props.store || new ServiceStore()

    this.fetchData(props.detail)
  }

  componentDidUpdate(prevProps) {
    const { visible, detail } = this.props
    if (visible && visible !== prevProps.visible) {
      this.fetchData(detail)
    }
  }

  fetchData(detail = {}) {
    if (detail.name && detail.namespace) {
      this.store.fetchDetail(detail).then(() => {
        this.setState({
          formTemplate: toJS(this.store.detail._originData),
        })
      })
    }
  }

  handleOk = () => {
    const { onOk } = this.props
    const form = this.formRef.current

    form &&
      form.validate(() => {
        const data = form.getData()
        set(data, 'metadata.resourceVersion', this.store.detail.resourceVersion)
        onOk(data)
      })
  }

  handleCancel = () => {
    const { onCancel } = this.props
    onCancel()
  }

  renderForm() {
    return (
      <ServiceForm
        formRef={this.formRef}
        formTemplate={this.state.formTemplate}
      />
    )
  }

  render() {
    const { visible, isSubmitting, detail } = this.props

    return (
      <Modal
        width={1162}
        title={t('Edit Service')}
        onOk={detail.type !== SERVICE_TYPES.Unknown ? this.handleOk : null}
        onCancel={this.handleCancel}
        okText={t('Update')}
        visible={visible}
        isSubmitting={isSubmitting}
      >
        <Loading spinning={this.store.isLoading}>{this.renderForm()}</Loading>
      </Modal>
    )
  }
}
