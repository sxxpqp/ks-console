import { observable, action } from 'mobx'
import { get, assign } from 'lodash'

export default class TerminalStore {
  username = get(globals, 'user.username', '')

  @observable
  kubectl = {
    cluster: '',
    namespace: '',
    pod: '',
    container: '',
    shell: 'bash',
    isLoading: true,
  }

  @observable
  kubeconfig = ''

  @observable
  connected = false

  constructor(props) {
    assign(this.kubectl, props)
  }

  getClusterPath({ cluster } = {}) {
    return cluster ? `/klusters/${cluster}` : ''
  }

  async kubeWebsocketUrl() {
    const { cluster, namespace, pod, container, shell = 'sh' } = this.kubectl
    const result = await request.get(
      `kapis/terminal.kubesphere.io/v1alpha2${this.getClusterPath({
        cluster,
      })}/namespaces/${namespace}/pods/${pod}/exec?container=${container}&shell=${shell}`,
      null,
      null,
      err => {
        if (err.status === 404) {
          return false
        }
        return true
      }
    )
    if (!result) {
      return `kapis/terminal.kubesphere.io/v1alpha2${this.getClusterPath({
        cluster,
      })}/namespaces/${namespace}/pods/${pod}?container=${container}&shell=${shell}`
    }

    return `kapis/terminal.kubesphere.io/v1alpha2${this.getClusterPath({
      cluster,
    })}/namespaces/${namespace}/pods/${pod}/exec?container=${container}&shell=${shell}`
  }

  @action
  async fetchKubeCtl({ cluster }) {
    this.kubectl.isLoading = true
    const result = await request.get(
      `kapis/resources.kubesphere.io/v1alpha2${this.getClusterPath({
        cluster,
      })}/users/${this.username}/kubectl`,
      null,
      null,
      this.reject
    )

    this.kubectl = {
      cluster,
      ...result,
      isLoading: false,
    }
  }

  @action
  async fetchKubeConfig(params) {
    const result = await request.get(
      `kapis/resources.kubesphere.io/v1alpha2${this.getClusterPath(
        params
      )}/users/${this.username}/kubeconfig`
    )
    this.kubeconfig = result
  }

  @action
  connect() {
    this.connected = true
  }

  @action
  disconnect() {
    this.connected = false
  }

  reject = res => {
    this.kubectl.isLoading = false
    window.onunhandledrejection(res)
  }
}
