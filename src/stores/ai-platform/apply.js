// import { set, cloneDeep } from 'lodash'
import { action, observable } from 'mobx'
// import axios from 'axios'
import BaseStore from '../base.list'

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
  async fetchList({ devops, workspace, devopsName, cluster, ...params } = {}) {
    this.list.isLoading = true

    const { page, limit, type } = params

    // const searchWord = name ? `*${encodeURIComponent(name)}*` : ''

    const url = `/apply`
    const result = await this.request.get(url, {
      start: (page - 1) * TABLE_LIMIT || 0,
      limit: TABLE_LIMIT,
      page,
      type,
    })

    this.list = {
      data: result.data || [],
      total: result.total_count || 0,
      limit: parseInt(limit, 10) || 10,
      page: parseInt(page, 10) || 1,
      selectedRowKeys: [],
      isLoading: false,
    }
  }

  // @action
  // async fetchDetail({ cluster, name, isSilent, devops }) {
  //   if (!isSilent) {
  //     this.isLoading = true
  //   }

  //   const result = await this.request.get(
  //     `${this.getDevopsUrlV2({
  //       cluster,
  //     })}${devops || this.devops}/pipelines/${decodeURIComponent(name)}/`
  //   )

  //   const resultKub = await this.request.get(
  //     `${this.getDevOpsDetailUrl({ devops, cluster })}/${this.module}/${name}`
  //   )

  //   this.setPipelineConfig(resultKub)
  //   this.detail = result
  //   this.isLoading = false
  //   return result
  // }
}
