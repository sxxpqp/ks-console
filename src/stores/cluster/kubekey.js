import { get } from 'lodash'
import { action, observable } from 'mobx'

import { safeParseJSON } from 'utils'
import ObjectMapper from 'utils/object.mapper'

import Base from 'stores/base'

export default class KubeKeyClusterStore extends Base {
  module = 'clusters'

  @observable
  parameters = {}

  get apiVersion() {
    return 'apis/kubekey.kubesphere.io/v1alpha1'
  }

  get mapper() {
    return ObjectMapper.kkclusters
  }

  @action
  async fetchParameters() {
    const result = await request.get(
      `api/v1/namespaces/kubekey-system/configmaps/kubekey-parameters`,
      {},
      {},
      () => {}
    )
    this.parameters = safeParseJSON(
      get(result, "data['parameters.json']", ''),
      {}
    )
  }
}
