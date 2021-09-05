import { omit, set, cloneDeep } from 'lodash'
import { action, observable, toJS } from 'mobx'
// import axios from 'axios'
import BaseStore from './base.list'

const TABLE_LIMIT = 10

export default class ApplyStore extends BaseStore {
  module = 'apply'

  @action
  async onSelectRowKeys(val) {
    // eslint-disable-next-line no-console
    console.log(val)
  }

  @observable
  list = {
    data: [],
    page: 1,
    limit: 10,
    total: 0,
    order: '',
    reverse: false,
    filters: {},
    isLoading: true,
    selectedRowKeys: [],
  }

  @observable
  detail = {}

  @observable
  isLoading = true

  @observable
  notFound = false

  catchRequestError(method = 'get', ...rest) {
    return request[method](...rest).catch(error => {
      return Promise.reject(error)
    })
  }

  request = {
    get: this.catchRequestError.bind(this, 'get'),
    post: this.catchRequestError.bind(this, 'post'),
  }

  @action
  async fetchList({ devops, workspace, devopsName, cluster, ...filters } = {}) {
    this.list.isLoading = true

    // eslint-disable-next-line no-unused-vars
    const { page, limit, name } = filters

    // const searchWord = name ? `*${encodeURIComponent(name)}*` : ''

    const url = `/apply`
    const result = await this.request.get(url, {
      start: (page - 1) * TABLE_LIMIT || 0,
      limit: TABLE_LIMIT,
      page: 0,
    })

    this.list = {
      data: result.data || [],
      total: result.total_count || 0,
      limit: parseInt(limit, 10) || 10,
      page: parseInt(page, 10) || 1,
      filters: omit(filters, 'devops'),
      selectedRowKeys: [],
      isLoading: false,
    }
  }

  @action
  async fetchDetail({ cluster, name, isSilent, devops }) {
    if (!isSilent) {
      this.isLoading = true
    }

    const result = await this.request.get(
      `${this.getDevopsUrlV2({
        cluster,
      })}${devops || this.devops}/pipelines/${decodeURIComponent(name)}/`
    )

    const resultKub = await this.request.get(
      `${this.getDevOpsDetailUrl({ devops, cluster })}/${this.module}/${name}`
    )

    this.setPipelineConfig(resultKub)
    this.detail = result
    this.isLoading = false
    return result
  }

  @action
  setDevops(devops) {
    this.devops = devops
  }

  @action
  async createPipeline({ data, devops, cluster }) {
    data.kind = 'Pipeline'
    data.apiVersion = 'devops.kubesphere.io/v1alpha3'

    const url = `${this.getDevOpsDetailUrl({
      devops,
      cluster,
    })}/pipelines`

    return await this.request.post(url, data)
  }

  @action
  async updatePipeline({ cluster, data, devops }) {
    data.kind = 'Pipeline'
    data.apiVersion = 'devops.kubesphere.io/v1alpha3'

    const url = `${this.getDevOpsDetailUrl({
      devops,
      cluster,
    })}/pipelines/${data.metadata.name}`

    const result = await this.request.put(url, data)
    this.setPipelineConfig(result)
    return result
  }

  @action
  updateJenkinsFile(jenkinsFile, params) {
    const data = cloneDeep(toJS(this.pipelineConfig))
    set(data, 'spec.pipeline.jenkinsfile', jenkinsFile)

    return this.updatePipeline({
      data,
      devops: params.devops,
      cluster: params.cluster,
    })
  }

  @action
  async delete({ name, devops, cluster }) {
    const url = `${this.getDevOpsDetailUrl({
      devops,
      cluster,
    })}/pipelines/${name}`

    return await this.request.delete(url)
  }
}
