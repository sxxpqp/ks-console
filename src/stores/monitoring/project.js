import { omit } from 'lodash'
import Base from './base'

export default class ProjectMonitoring extends Base {
  handleParams = params => omit(params, ['cluster', 'workspace'])

  getApi = ({ workspace, namespace }) => {
    let path = '/namespaces'
    path += namespace ? `/${namespace}` : ''
    if (workspace && !namespace) {
      path = `/workspaces/${workspace}${path}`
    }
    return `${this.apiVersion}${path}`
  }
}
