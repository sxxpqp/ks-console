import Base from '../base'

export default class ServicePolicyStore extends Base {
  constructor() {
    super()
    this.module = 'servicepolicies'
  }

  get apiVersion() {
    return 'apis/servicemesh.kubesphere.io/v1alpha2'
  }
}
