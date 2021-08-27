import Base from './base'

export default class NodeMonitoring extends Base {
  resourceName = 'node'

  getApi = () => `${this.apiVersion}/nodes`
}
