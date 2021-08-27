import { get } from 'lodash'
import { action } from 'mobx'
import Base from './base'

export default class SecretStore extends Base {
  module = 'secrets'

  @action
  async validateImageRegistrySecret(data) {
    const { url, username, password } = data

    const params = { username, password, serverhost: url }

    const result = {
      validate: true,
      reason: '',
    }

    await request.post(
      `kapis/resources.kubesphere.io/v1alpha2/registry/verify`,
      params,
      {},
      (_, err) => {
        const msg = get(err, 'message', '')
        if (msg) {
          result.reason = t(msg)
        }
        result.validate = false
      }
    )

    return result
  }
}
