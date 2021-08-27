import Base from './base'

export default class PlatformMonitoring extends Base {
  getApi = () => `${this.apiVersion}/kubesphere`
}
