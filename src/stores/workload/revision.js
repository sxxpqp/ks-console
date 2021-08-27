import { action, observable, toJS } from 'mobx'

import { joinSelector } from 'utils'
import { getCurrentRevision } from 'utils/workload'
import ObjectMapper from 'utils/object.mapper'
import { MODULE_KIND_MAP } from 'utils/constants'

import Base from 'stores/base'

export default class RevisionStore extends Base {
  @observable
  workloadDetail = {}

  @observable
  currentRevision = 0

  constructor(module) {
    super()
    this.module = module
  }

  getDetailUrl = ({ name, cluster, namespace, revision }) =>
    `kapis/resources.kubesphere.io/v1alpha2${this.getPath({
      cluster,
      namespace,
    })}/${this.module}/${name}/revisions/${revision}`

  @action
  async fetchList({ cluster, namespace, name, selector }) {
    this.list.isLoading = true

    const labelSelector = joinSelector(selector)
    const prefix =
      this.module === 'deployments'
        ? `apis/apps/v1${this.getPath({ cluster, namespace })}/replicasets`
        : `apis/apps/v1${this.getPath({
            cluster,
            namespace,
          })}/controllerrevisions`
    const result = await request.get(`${prefix}?labelSelector=${labelSelector}`)

    const data = result.items
      .map(ObjectMapper.revisions)
      .filter(
        revision =>
          revision.ownerName === name &&
          revision.ownerKind === MODULE_KIND_MAP[this.module]
      )

    this.list.update({
      data,
      isLoading: false,
    })
  }

  @action
  async fetchDetail({ name, cluster, namespace, revision }) {
    this.isLoading = true

    const result = await request.get(
      this.getDetailUrl({ name, cluster, namespace, revision })
    )
    const detail = ObjectMapper.revisions(result)

    this.detail = detail
    this.isLoading = false
  }

  @action
  async fetchWorkloadDetail({ name, cluster, namespace }) {
    const result = await request.get(
      `apis/apps/v1${this.getPath({ cluster, namespace })}/${
        this.module
      }/${name}`
    )
    this.workloadDetail = ObjectMapper[this.module](result)
  }

  @action
  async fetchCurrentRevision(workload = {}) {
    await this.fetchList(workload)
    this.currentRevision = getCurrentRevision(
      toJS(workload),
      toJS(this.list.data),
      this.module
    )
  }
}
