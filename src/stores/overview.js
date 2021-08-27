import { action, observable } from 'mobx'
import { to } from 'utils'

export default class DashboardStore {
  @observable
  resource = {
    quota: {},
    status: {},
    isLoading: true,
  }

  getPath({ cluster, namespace }) {
    let path = ''
    if (cluster) {
      path += `/klusters/${cluster}`
    }
    if (namespace) {
      path += `/namespaces/${namespace}`
    }
    return path
  }

  @action
  async fetchResourceStatus(params) {
    this.resource.isLoading = true

    const [quota, status] = await Promise.all([
      to(
        request.get(
          `kapis/resources.kubesphere.io/v1alpha2${this.getPath(params)}/quotas`
        )
      ),
      to(
        request.get(
          `kapis/resources.kubesphere.io/v1alpha2${this.getPath(
            params
          )}/abnormalworkloads`
        )
      ),
    ])

    this.resource = {
      quota: quota.data,
      status: status.data,
      isLoading: false,
    }
  }
}
