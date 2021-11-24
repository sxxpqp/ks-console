import { observable, action } from 'mobx'
import { getAppList, updateAppList } from 'api/platform'
import { Notify } from '@kube-design/components'

export default class ApplicationStore {
  @observable
  lists = []

  @observable
  getDataFunc = null

  @observable
  pagination = {
    type: '',
    status: '',
    name: '',
    current: 1,
    pageSize: 10,
    total: 0,
    tagId: '',
    onChange: this.handlePaginationChange,
  }

  @action
  getData = pagination => {
    getAppList(pagination || this.pagination).then(res => {
      const { code, data, total } = res
      if (code === 200) {
        this.lists = data
        this.pagination = { ...this.pagination, total }
      }
    })
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
}
