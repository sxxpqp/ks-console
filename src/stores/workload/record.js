import { action, observable } from 'mobx'
import { isEmpty, get } from 'lodash'

import { joinSelector } from 'utils'

import Base from '../base'

export default class RecordStore extends Base {
  @observable
  excute = {
    data: [],
    page: 1,
    limit: 10,
    total: 0,
    isLoading: true,
  }

  constructor() {
    super()
    this.module = 'jobs'
  }

  get apiVersion() {
    return 'apis/kubesphere.io/v1alpha1'
  }

  @action
  async fetchListByK8s({ cluster, namespace, selector, ...params }) {
    this.list.isLoading = true

    if (!isEmpty(selector)) {
      params.labelSelector = joinSelector(selector)
    }

    const result = await request.get(
      `apis/batch/v1${this.getPath({ cluster, namespace })}/${this.module}`,
      params
    )
    const data = result.items || []

    this.list.update({
      data: data.map(this.mapper),
      total: data.length,
      isLoading: false,
      selectedRowKeys: [],
    })

    return data
  }

  @action
  async fetchExcuteRecords(params) {
    this.excute.isLoading = true

    const result = await request.get(
      `apis/batch/v1${this.getPath(params)}/${this.module}/${params.name}`
    )
    const detail = this.mapper(result)

    let data = []
    try {
      const records = JSON.parse(get(detail, 'annotations.revisions', {}))
      data = Object.entries(records).map(([key, value]) => ({
        ...value,
        id: key,
      }))
    } catch (e) {}

    this.excute = {
      data,
      total: data.length || 0,
      isLoading: false,
    }
  }
}
