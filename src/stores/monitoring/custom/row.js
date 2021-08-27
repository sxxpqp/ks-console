import { observable, action } from 'mobx'
import { includes } from 'lodash'

export default class MonitorRow {
  @observable
  monitors = []

  @observable
  config = {}

  constructor({ config = {}, monitors = [] } = {}) {
    this.config = config
    this.monitors = monitors.map(monitor => monitor.belong(this))
  }

  push(monitor) {
    monitor.belong(this)
    this.monitors.push(monitor)
    return this
  }

  has(monitor) {
    return includes(this.monitors, monitor)
  }

  @action
  updateMonitors(monitors) {
    this.monitors = monitors
  }

  @action
  deleteTextMonitorByIndex(index) {
    this.monitors.splice(index, 1)
  }
}
