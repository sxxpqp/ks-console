import { action, observable } from 'mobx'

export default class List {
  @observable
  data = []

  page = 1

  limit = 10

  @observable
  total = 0

  @observable
  filters = {}

  continues = { 1: '' }

  @observable
  isLoading = true

  @observable
  selectedRowKeys = []

  @action
  update(params) {
    this.filters = {}
    Object.keys(params).forEach(key => {
      if (Object.prototype.hasOwnProperty.call(this, key)) {
        this[key] = params[key]
      } else if (params[key]) {
        this.filters[key] = params[key]
      }
    })
  }

  @action
  updateItem(item) {
    if (item.uid) {
      const index = this.data.findIndex(_item => _item.uid === item.uid)
      if (index >= 0) {
        this.data[index] = { ...this.data[index], ...item }
        this.data = [...this.data]
      }
    }
  }

  @action
  setSelectRowKeys = rowKeys => {
    this.selectedRowKeys = rowKeys
  }
}
