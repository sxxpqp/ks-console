import { action, observable, computed } from 'mobx'
import { getGroups, addGroups, removeGroups, editGroups } from 'api/users'
import { getNodes } from 'api/platform'
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

  @observable
  tmpItem = {
    key: '-1',
    pid: -1,
    type: 1,
  }

  @observable
  nodes = []

  @observable
  nodesTotal = 0

  @computed
  get childItems() {
    return (
      this.originData.filter(item => item.pid === this.selectedItem.id) || []
    )
  }

  @computed
  get nodesFail() {
    return this.nodes.filter(item => item.status !== 'Running').length
  }

  @action
  getNodesData() {
    getNodes({ current: 1, pageSize: 99999 })
      .then(res => {
        if (res.code === 200) {
          this.nodes = res.data
          this.nodesTotal = res.total
        }
      })
      // eslint-disable-next-line no-unused-vars
      .catch(err => {
        this.setState({
          loading: false,
        })
      })
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
