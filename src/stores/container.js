import { observable, action } from 'mobx'
import { get } from 'lodash'

import ObjectMapper from 'utils/object.mapper'
import { getWorkloadVolumes } from 'utils/workload'

export default class ContainerStore {
  @observable
  detail = {}

  @observable
  isLoading = true

  @observable
  volumes = []

  @observable
  logs = {
    data: '',
    isLoading: true,
  }

  watchHandler = null

  module = 'containers'

  getDetailUrl = ({ cluster, namespace, podName }) => {
    let path = `api/v1`

    if (cluster) {
      path += `/klusters/${cluster}`
    }

    return `${path}/namespaces/${namespace}/pods/${podName}`
  }

  getPath = ({ cluster }) => {
    let path = ''

    if (cluster) {
      path += `/klusters/${cluster}`
    }

    return path
  }

  @action
  async fetchDetail({ cluster, namespace, podName, containerName }) {
    this.isLoading = true

    const result = await request.get(
      this.getDetailUrl({ cluster, namespace, podName })
    )
    const pod = ObjectMapper.pods(result)
    const detail =
      pod.containers.find(item => item.name === containerName) ||
      pod.initContainers.find(item => item.name === containerName)
    detail.createTime = get(pod, 'createTime', '')
    detail.app = detail.app || pod.app
    detail.cluster = cluster
    pod.cluster = cluster

    this.volumes = await getWorkloadVolumes(pod)

    this.detail = detail
    this.isLoading = false
  }

  @action
  async watchLogs(
    { cluster, namespace, podName, silent, ...params },
    callback
  ) {
    if (!silent) {
      this.logs.isLoading = true
    }

    if (params.follow) {
      this.watchHandler = request.watch(
        `${this.getDetailUrl({ cluster, namespace, podName })}/log`,
        params,
        data => {
          this.logs = {
            data,
            isLoading: false,
          }
          callback()
        }
      )
    } else {
      const result = await request.get(
        `${this.getDetailUrl({ cluster, namespace, podName })}/log`,
        params
      )

      this.logs = {
        data: result,
        isLoading: false,
      }

      callback()
    }
  }

  @action
  stopWatchLogs() {
    this.watchHandler && this.watchHandler.abort()
  }

  async checkPreviousLog({ cluster, namespace, podName, ...params }) {
    const result = await request.get(
      `${this.getDetailUrl({ cluster, namespace, podName })}/log`,
      params,
      {},
      () => {}
    )

    return !!result
  }

  @action
  async fetchAllLogs({ cluster, namespace, podName, ...params }) {
    return await request.get(
      `${this.getDetailUrl({ cluster, namespace, podName })}/log`,
      params
    )
  }

  @action
  getDockerImagesLists = async params =>
    await request.get(
      `dockerhub/api/content/v1/products/search`,
      params,
      {
        headers: {
          'Search-Version': 'v3',
        },
      },
      () => {}
    )

  @action
  getImageDetail = async ({ cluster, ...params }) => {
    const result = await request.get(
      `kapis/resources.kubesphere.io/v1alpha2${this.getPath({
        cluster,
      })}/registry/blob`,
      params,
      null,
      (e, data) => data
    )

    if (get(result, 'status', 'succeeded') !== 'succeeded') {
      return { status: 'failed', message: result.message }
    }

    return ObjectMapper.imageBlob(result)
  }
}
