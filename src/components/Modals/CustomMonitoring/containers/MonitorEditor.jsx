import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { computed } from 'mobx'

import FormContainer from '../components/FormContainer'
import TextMonitorForm from './TextMonitorForm'
import GraphMonitorForm from './GraphMonitorForm'
import TableMonitorForm from './TableMonitorForm'

const FormMap = {
  singlestat: TextMonitorForm,
  graph: GraphMonitorForm,
  table: TableMonitorForm,
}

@inject('modalStore', 'monitoringStore')
@observer
export default class MonitorEditor extends Component {
  @computed
  get monitor() {
    const { modalStore } = this.props
    const { selectedMonitor } = modalStore
    return selectedMonitor
  }

  @computed
  get isNewMonitor() {
    const selectedMonitor = this.monitor
    const monitorRow = selectedMonitor.belongTo
    return !monitorRow.has(selectedMonitor)
  }

  temporaryMonitor = this.getTemporaryMonitor()

  getTemporaryMonitor() {
    return this.isNewMonitor ? this.monitor : this.monitor.clone()
  }

  componentDidMount() {
    this.temporaryMonitor.monitoring(this.props.monitoringStore)
  }

  componentWillUnmount() {
    this.temporaryMonitor.stopMonitoring()
  }

  handleCancel = () => {
    this.props.modalStore.unSelectMonitor()
  }

  handleSubmit = () => {
    this.isNewMonitor
      ? this.monitor.belongTo.push(this.temporaryMonitor)
      : (this.monitor.config = this.temporaryMonitor.config)

    this.props.modalStore.unSelectMonitor()
  }

  render() {
    const Form = FormMap[this.monitor.type]

    return (
      <FormContainer
        formData={this.temporaryMonitor.config}
        onSubmit={this.handleSubmit}
        onCancel={this.handleCancel}
      >
        {Form ? (
          <Form monitor={this.temporaryMonitor} />
        ) : (
          t('MONITOR_TYPE_NO_SUPPORT')
        )}
      </FormContainer>
    )
  }
}
