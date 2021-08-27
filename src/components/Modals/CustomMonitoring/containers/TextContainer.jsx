import React from 'react'
import { observer, inject } from 'mobx-react'
import { computed } from 'mobx'

import TextPanelListEditor from '../components/TextPanelList'

@inject('monitoringStore', 'modalStore')
@observer
export default class TextContainer extends React.Component {
  @computed
  get monitoringStore() {
    return this.props.monitoringStore
  }

  @computed
  get modalStore() {
    return this.props.modalStore
  }

  @computed
  get textMonitorsRow() {
    return this.monitoringStore.textMonitors
  }

  @computed
  get monitors() {
    return this.textMonitorsRow.monitors
  }

  /**
   * format monitor metrics make it eazy to render
   */
  @computed
  get textMonitorData() {
    return this.monitors.map(monitor => {
      const { title, id } = monitor.config || {}
      return {
        title,
        id,
        value: monitor.stat,
        errorMessage: monitor.errorMessage,
      }
    })
  }

  /**
   * monitor the template change
   */
  componentDidMount() {
    this.monitors.forEach(monitor => monitor.monitoring(this.monitoringStore))
  }

  componentWillUnmount() {
    this.monitors.forEach(monitor => monitor.stopMonitoring())
  }

  componentDidUpdate() {
    this.monitors.forEach(monitor => monitor.monitoring(this.monitoringStore))
  }

  handleDelete = index => {
    this.monitors[index].stopMonitoring()
    this.textMonitorsRow.deleteTextMonitorByIndex(index)
  }

  handleEdit = index => {
    const selectMonitor = this.textMonitorsRow.monitors[index]
    this.props.modalStore.selectMonitor(selectMonitor)
  }

  handleAdd = () => {
    const newMonitor = this.monitoringStore.generateNewTextMonitor()
    this.modalStore.selectMonitor(newMonitor)
  }

  handleSort = sortMonitors => {
    const monitors = sortMonitors.map(({ monitor }) => monitor)
    this.textMonitorsRow.updateMonitors(monitors)
  }

  render() {
    const { isEditing } = this.props.monitoringStore
    const textMonitorData = this.textMonitorData
    const textPanels = textMonitorData
    const monitors = this.monitors.map(monitor => ({ monitor }))

    return (
      <TextPanelListEditor
        isEditing={isEditing}
        monitors={monitors}
        textPanels={textPanels}
        onSort={this.handleSort}
        onDelete={this.handleDelete}
        onEdit={this.handleEdit}
        onAdd={this.handleAdd}
      />
    )
  }
}
