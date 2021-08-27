import { action, observable } from 'mobx'

export default class Members {
  @observable
  data = []

  originData = []

  page = 1

  limit = 10

  @observable
  total = 0

  order = ''

  reverse = false

  silent = false

  filters = {}

  @observable
  isLoading = true

  @observable
  selectedRowKeys = []

  @action
  update(params) {
    Object.keys(params).forEach(key => {
      this[key] = params[key]
    })
  }

  @action
  init({ originData = [], paging = true } = {}) {
    this.originData = originData
    this.data = paging ? originData.slice(0, this.limit) : originData
    this.page = 1
    this.total = originData.length
  }

  @action
  paging({ page } = {}) {
    this.isLoading = true
    this.page = page
    this.data = this.originData.slice(
      (page - 1) * this.limit,
      page * this.limit
    )
    this.isLoading = false
  }
}
