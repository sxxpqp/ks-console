import Base from 'stores/base'

export default class ServiceMonitorStore extends Base {
  module = 'servicemonitors'

  get apiVersion() {
    return 'apis/monitoring.coreos.com/v1'
  }
}
