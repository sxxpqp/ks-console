import { action, observable, computed } from 'mobx'
import { getGroups, addGroups, removeGroups, editGroups } from 'api/users'
import { list2Tree } from 'utils/tree'

export default class AiGroup {
  @observable
  treeData = []

  @observable
  originData = []

  @observable
  selectedItem = {
    key: '-1',
    pid: -1,
    type: 1,
  }

  @computed
  get childItems() {
    return (
      this.originData.filter(item => item.pid === this.selectedItem.id) || []
    )
  }

  @action
  getData() {
    return getGroups().then(res => {
      if (res.code === 200) {
        const data = list2Tree(res.data)
        this.treeData = data
        this.originData = res.data
      }
    })
  }

  @action
  addData(item) {
    return addGroups(item).then(res => {
      if (res.code === 200) {
        this.getData()
      }
      return res
    })
  }

  @action
  editData(item) {
    return editGroups(item).then(res => {
      if (res.code === 200) {
        this.getData()
      }
      return res
    })
  }

  @action
  removeData(id) {
    return removeGroups(id).then(res => {
      if (res.code === 200) {
        this.getData()
      }
      return res
    })
  }

  @action
  setItem(item) {
    this.selectedItem = item
  }
}
