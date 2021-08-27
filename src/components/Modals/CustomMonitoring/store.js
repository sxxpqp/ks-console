import { observable, action } from 'mobx'

export default class CustomMonitoringModalStore {
  @observable
  theme = 'dark'

  @observable
  selectedMonitor = null

  @observable
  shouldNewMonitorModalShow = false

  @action
  selectMonitor(monitor) {
    this.selectedMonitor = monitor
  }

  @action
  unSelectMonitor() {
    this.selectedMonitor = null
  }

  @action
  changeTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light'
  }

  @action
  showNewMonitorModal() {
    this.shouldNewMonitorModalShow = true
  }

  @action
  hideNewMonitorModal() {
    this.shouldNewMonitorModalShow = false
  }
}
