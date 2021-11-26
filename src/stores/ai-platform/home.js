import { observable, action, computed } from 'mobx'
import { getUserInfo, getImages } from 'api/users'

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
  }

  @observable
  summary = {}

  @observable
  imageList = []

  @action
  getUser() {
    getUserInfo().then(res => {
      const { code, data } = res
      if (code === 200) {
        this.user = data.length ? data[0] : {}
        globals.user.ai = this.user
      }
    })
  }

  @action
  getUserImages() {
    getImages(this.pagination).then(res => {
      if (res.code === 200) {
        this.imageList = res.data
        this.pagination = {
          ...this.pagination,
          total: res.total || 0,
        }
      }
    })
  }
}
