import { observable, action, computed } from 'mobx'
import { getUserInfo, getImages, getImageTags } from 'api/users'

export default class HomeStore {
  constructor() {
    this.getUser()
  }

  @observable
  user = {}

  @computed
  get groups() {
    return this.user.users_groups || []
  }

  @computed
  get isAdmin() {
    return this.user.users_groups.map(i => i.isAdmin).includes(1)
  }

  // ====================== 镜像列表相关 ======================
  @observable
  pagination = {
    pageSize: 10,
    current: 1,
    total: 0,
    type: 1,
    name: '',
    onChange: this.handlePaginationChange,
  }

  @observable
  loading = false

  @observable
  tagPagination = {
    pageSize: 10,
    current: 1,
    total: 0,
    name: '',
    onChange: this.handleTabsPaginationChange,
  }

  @observable
  summary = {}

  @observable
  imageList = []

  @observable
  tagsList = []

  @action
  getUser() {
    return getUserInfo().then(res => {
      const { code, data } = res
      if (code === 200) {
        this.user = data.length ? data[0] : {}
        globals.user.ai = this.user
      }
      return res
    })
  }

  @action
  getUserImages() {
    this.loading = true
    getImages(this.pagination)
      .then(res => {
        if (res.code === 200) {
          this.imageList = res.data
          this.pagination = {
            ...this.pagination,
            total: res.total || 0,
          }
        }
      })
      .finally(() => {
        this.loading = false
      })
  }

  @action
  handlePaginationChange = value => {
    this.pagination = { ...this.pagination, current: value }
    this.getUserImages()
  }

  @action
  getUserImagesTags() {
    getImageTags(this.tagPagination).then(res => {
      if (res.code === 200) {
        this.tagsList = res.data
        this.tagPagination = {
          ...this.tagPagination,
          total: res.total || 0,
        }
      }
    })
  }

  @action
  handleTabsPaginationChange = value => {
    this.tagPagination = {
      ...this.tagPagination,
      current: value,
    }
    this.getUserImagesTags()
  }
}
