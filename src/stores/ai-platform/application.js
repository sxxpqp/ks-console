import { observable, action, computed } from 'mobx'
import {
  getAppList,
  updateAppList,
  getAbnormalApp,
  getAlertMessage,
} from 'api/platform'
import { Notify } from '@kube-design/components'

export default class ApplicationStore {
  @observable
  lists = []

  @observable
  abnormalApp = []

  @observable
  alertMsgs = []

  @observable
  abnormalAppTotal = 0

  @observable
  getDataFunc = null

  @observable
  alertPagination = {
    msg: '',
    status: '',
    level: '',
    read: '',
    rule: '',
    current: 1,
    pageSize: 10,
    total: 0,
    onChange: this.handleAlertPaginationChange,
  }

  @observable
  pagination = {
    type: '',
    status: '',
    name: '',
    current: 1,
    pageSize: 10,
    total: 0,
    tagId: '',
    pid: '',
    onChange: this.handlePaginationChange,
  }

  @computed
  get total() {
    return this.pagination.total
  }

  @computed
  get allNameSpaces() {
    return Array.from(new Set(this.lists.map(i => i.namespace)))
  }

  @computed
  get totalFail() {
    return this.lists.filter(i => i.status === 0).length
  }

  @action
  getData = pagination => {
    // console.log(this.pagination)
    getAppList(pagination || this.pagination).then(res => {
      const { code, data, total } = res
      if (code === 200) {
        this.lists = data
        this.pagination = { ...this.pagination, total }
      }
    })
  }

  @action
  handleAlertPaginationChange = value => {
    this.alertPagination = {
      ...this.alertPagination,
      current: value,
    }
    this.getAlertMsg()
  }

  @action
  handlePaginationChange = value => {
    this.pagination = { ...this.pagination, current: value }
    this.getData(this.pagination)
  }

  @action
  updateList = ({ namespace, workspace }) => {
    Notify.success('创建中，创建成功后自动刷新列表，请等待')
    updateAppList({ namespace, workspace })
      .then(res => {
        const { code } = res
        if (code === 200) {
          Notify.success('创建成功')
          this.getDataFunc && this.getDataFunc(this.pagination)
        } else {
          Notify.error(`创建失败${res.message}`)
        }
      })
      .catch(err => err)
  }

  @action
  getErrorApps = () => {
    getAbnormalApp().then(res => {
      const { code, data, total } = res
      if (code === 200) {
        this.abnormalApp = data
        this.abnormalAppTotal = total
      }
    })
  }

  @action
  getAlertMsg = () => {
    getAlertMessage(this.alertPagination).then(res => {
      const { code, data, total } = res
      if (code === 200) {
        this.alertPagination = {
          ...this.alertPagination,
          total: total || 0,
        }
        this.alertMsgs = data
      }
    })
  }
}
