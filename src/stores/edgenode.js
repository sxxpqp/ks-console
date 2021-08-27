import { API_VERSIONS } from 'utils/constants'
import NodeStore from './node'

export default class EdgeNodeStore extends NodeStore {
  module = 'edgenodes'

  get apiVersion() {
    return API_VERSIONS['nodes'] || ''
  }

  getListUrl = (params = {}) =>
    `${this.apiVersion}${this.getPath(params)}/nodes${
      params.dryRun ? '?dryRun=All' : ''
    }`

  getResourceUrl = (params = {}) =>
    `kapis/resources.kubesphere.io/v1alpha3${this.getPath(params)}/nodes`

  createEdgeNode = async ({ cluster, name, ip, defaultTaint }) => {
    const url = `kapis/kubeedge.kubesphere.io/v1alpha1/${this.getPath({
      cluster,
    })}/nodes/join`

    const result = await request.get(
      url,
      { node_name: name, node_ip: ip, add_default_taint: defaultTaint },
      {},
      resp => {
        return resp
      }
    )
    return result
  }
}
