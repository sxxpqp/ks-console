import { observable, action } from 'mobx'
import { get } from 'lodash'

export default class LabelSets {
  apiVersion = `kapis/monitoring.kubesphere.io/v1alpha3`

  @observable
  labelsets = {}

  getPath({ cluster, namespace } = {}) {
    let path = ''
    if (cluster) {
      path += `/klusters/${cluster}`
    }
    if (namespace) {
      path += `/namespaces/${namespace}`
    }
    return path
  }

  @action
  async fetchLabelSets({ cluster, namespace, ...params } = {}) {
    const result = await request.get(
      `${this.apiVersion}${this.getPath({
        cluster,
        namespace,
      })}/targets/labelsets`,
      params
    )

    const data = get(result, 'data') || []

    const labelsets = {}

    data.forEach(item => {
      Object.keys(item).forEach(key => {
        labelsets[key] = labelsets[key] || []
        if (!labelsets[key].includes(item[key])) {
          labelsets[key].push(item[key])
        }
      })
    })

    this.labelsets = labelsets
  }
}
