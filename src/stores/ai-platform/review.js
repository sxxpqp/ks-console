import { action, observable, computed } from 'mobx'
import {
  getApply,
  getResources,
  getApplyHisAll,
  getGroupResources,
  getResourceTemplate,
  addResourceTemplate,
  editResourceTemplate,
  removeResourceTemplate,
} from 'api/apply'

export const getSum = (lists = [], usedFlag = false) => {
  const keys = usedFlag
    ? ['cpu_used', 'mem_used', 'disk_used', 'gpu_used']
    : ['cpu', 'mem', 'disk', 'gpu']
  const obj = lists.reduce((sum, cur) => {
    keys.forEach(key => {
      sum[key] += parseFloat(cur[key], 10)
    })
    return sum
  }, Object.assign({}, ...keys.map(key => ({ [key]: 0 }))))
  return obj
}

const cpuOpts = [
  1,
  2,
  4,
  8,
  12,
  16,
  20,
  24,
  32,
  40,
  48,
  52,
  64,
  72,
  80,
  96,
  104,
  208,
]

const memOpts = [
  1,
  2,
  4,
  8,
  16,
  24,
  32,
  48,
  64,
  88,
  96,
  128,
  176,
  192,
  256,
  288,
  352,
  384,
  512,
  768,
  1536,
  3072,
]

const gpuOpts = [0, 1, 2, 4, 8, 12, 16, 20, 24, 32]

export default class ReviewStore {
  // 节点列表
  @observable
  nodes = []

  // 资源模板列表
  @observable
  templates = []

  // 用户已申请资源列表 - 通过的所有申请资源
  @observable
  lists = []

  // 申请资源列表getApply -> 用户申请历史
  @observable
  allHis = []

  // 申请资源列表getApply -> 用于审批
  @observable
  allAdminHis = []

  // 用户组可以使用的节点资源列表
  @observable
  group = []

  @observable
  params = {
    pageSize: 10,
    current: 1,
    status: 0,
    total: 0,
  }

  @computed
  get countRes() {
    return getSum(this.lists)
  }

  @computed
  get countGroupRes() {
    return getSum(this.group)
  }

  @computed
  get countGroupUsedRes() {
    return getSum(this.group, true)
  }

  @computed
  get cpuOptions() {
    return cpuOpts.filter(i => i <= this.countGroupRes.cpu)
  }

  @computed
  get memOptions() {
    return memOpts.filter(i => i <= this.countGroupRes.mem)
  }

  @computed
  get gpuOptions() {
    return gpuOpts.filter(i => i <= this.countGroupRes.gpu)
  }

  @action
  setParams(params) {
    this.params = {
      ...this.params,
      ...params,
    }
  }

  @action
  getApplyHis() {
    getApply(this.params).then(res => {
      this.allHis = res.data
      this.params.total = res.total || 0
    })
  }

  // 管理员列表
  @action
  getApplyHisAll() {
    getApplyHisAll(this.params).then(res => {
      this.allAdminHis = res.data
      this.params.total = res.total || 0
    })
  }

  @action
  getResTotal(id) {
    return getResources({ id }).then(res => {
      this.lists = res.data
      return res
    })
  }

  // 获取组织资源
  @action
  getGroupResTotal(id) {
    return getGroupResources({ id }).then(res => {
      this.group = res.data
      return res
    })
  }

  // 获取资源模板列表
  @action
  getTemplates(params) {
    getResourceTemplate(params).then(res => {
      this.templates = res.data
    })
  }

  // 添加资源模板
  @action
  addTemplates(params) {
    return addResourceTemplate(params).then(res => {
      if (res.code === 200) {
        this.getTemplates()
      }
      return res
    })
  }

  // 编辑资源模板
  @action
  editTemplates(params) {
    return editResourceTemplate(params).then(res => {
      if (res.code === 200) {
        this.getTemplates()
      }
      return res
    })
  }

  // 删除资源模板
  @action
  removeTemplates(params) {
    return removeResourceTemplate(params).then(res => {
      if (res.code === 200) {
        this.getTemplates()
      }
      return res
    })
  }
}
