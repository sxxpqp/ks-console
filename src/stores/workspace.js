import { get, isEmpty } from 'lodash'
import { action, observable } from 'mobx'
import ObjectMapper from 'utils/object.mapper'
import { DEFAULT_CLUSTER } from 'utils/constants'

import Base from 'stores/base'
import List from 'stores/base.list'

export default class WorkspaceStore extends Base {
  @observable
  initializing = true

  module = 'workspaces'

  clusters = new List()

  @observable
  cluster = ''

  namespaces = new List()

  devops = new List()

  getResourceUrl = (params = {}) =>
    params.cluster
      ? `kapis/resources.kubesphere.io/v1alpha3${this.getPath(params)}/${
          this.module
        }`
      : `kapis/tenant.kubesphere.io/v1alpha2${this.getPath(params)}/${
          this.module
        }`

  getListUrl = this.getResourceUrl

  @action
  async fetchDetail({ cluster, workspace } = {}) {
    if (isEmpty(workspace)) {
      return
    }

    this.isLoading = true
    const detail = await request.get(
      this.getDetailUrl({ name: workspace, cluster }),
      null,
      null,
      (_, err) => {
        if (
          err.reason === 'Not Found' ||
          err.reason === 'No Such Object' ||
          err.reason === 'Forbidden'
        ) {
          global.navigateTo('/404')
        }
      }
    )

    this.detail = { ...this.mapper(detail), cluster }
    this.isLoading = false

    return { ...this.mapper(detail), cluster }
  }

  @action
  async fetchClusters({ workspace, more } = {}) {
    this.clusters.isLoading = true

    const params = {}

    let result
    if (globals.app.isMultiCluster) {
      result = await request.get(
        `kapis/tenant.kubesphere.io/v1alpha2/workspaces/${workspace}/clusters`,
        params
      )
    } else {
      result = { items: [DEFAULT_CLUSTER] }
    }

    const items = result.items.map(ObjectMapper.clusters)

    this.clusters.update({
      data: more ? [...this.namespaces.data, ...items] : items,
      total: result.totalItems,
      limit: 10,
      page: 1,
      isLoading: false,
    })

    if (this.clusters.data.length > 0) {
      this.selectCluster(
        get(
          this.clusters.data.find(cluster => cluster.isReady),
          'name'
        )
      )
    }
  }

  @action
  selectCluster(cluster) {
    this.cluster = cluster
  }
}
