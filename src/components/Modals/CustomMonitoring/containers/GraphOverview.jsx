import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { computed } from 'mobx'

import GraphList from './GraphList'
import GraphRowsEditor from './GraphRowsEditor'
import GraphOverviewLayout from '../components/GraphOverviewLayout'

import GraphRows from '../components/GraphRows'

@inject('monitoringStore')
@observer
export default class GraphOverview extends Component {
  @computed
  get monitoringStore() {
    return this.props.monitoringStore
  }

  @computed
  get graphMonitorRows() {
    return this.monitoringStore.graphMonitorRows
  }

  @computed
  get unNameGraphRowMonitors() {
    return this.monitoringStore.unNameGraphRow.monitors
  }

  @computed
  get monitorsInRows() {
    return this.graphMonitorRows.reduce(
      (monitors, row) => [...monitors, ...row.monitors],
      []
    )
  }

  @computed
  get allMonitors() {
    return [...this.unNameGraphRowMonitors, ...this.monitorsInRows]
  }

  componentDidMount() {
    this.allMonitors.forEach(monitor =>
      monitor.monitoring(this.monitoringStore)
    )
  }

  componentWillUnmount() {
    this.allMonitors.forEach(monitor => {
      monitor.stopMonitoring()
      monitor.clearMonitorMetrics()
    })
  }

  render() {
    const { isEditing } = this.props.monitoringStore

    return (
      <GraphOverviewLayout
        graphList={
          <GraphList
            rows={[
              this.monitoringStore.unNameGraphRow,
              ...this.graphMonitorRows,
            ]}
            monitos={this.allMonitors}
          />
        }
        graphRowList={isEditing ? <GraphRowsEditor /> : this.renderGraphRows()}
      />
    )
  }

  monitorStatFactory(monitor) {
    return {
      id: monitor.config.id,
      title: monitor.config.title,
      metrics: monitor.stats.map(stat => ({
        title: stat.name,
        id: stat.id,
        color: stat.color,
        value: stat.stat,
      })),
    }
  }

  renderGraphRows() {
    const unNameRowStat = [
      {
        id: 0,
        hideTitle: true,
        panels: this.unNameGraphRowMonitors.map(this.monitorStatFactory, this),
      },
    ]

    const rowsStat = this.graphMonitorRows.map(row => ({
      title: row.config.title,
      id: row.config.id,
      panels: row.monitors.map(this.monitorStatFactory, this),
    }))

    return (
      <>
        <GraphRows rows={unNameRowStat} />
        <GraphRows rows={rowsStat} />
      </>
    )
  }
}
