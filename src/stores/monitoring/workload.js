import Base from './base'

export default class WorkloadMonitor extends Base {
  getApi = ({ name, namespace }) => {
    const namePath = name ? `/${name}` : ''
    return `${this.apiVersion}/namespaces/${namespace}/workloads/${this.module}${namePath}`
  }
}
