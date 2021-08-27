import Base from './base'

export default class ContainerMonitoring extends Base {
  resourceName = 'container'

  getApi = ({ namespace, podName, container }) =>
    `${this.apiVersion}/namespaces/${namespace}/pods/${podName}/containers/${container}`
}
