import BaseStore from 'stores/base'

export default class Base extends BaseStore {
  get apiVersion() {
    return 'kapis/notification.kubesphere.io/v2beta1'
  }

  getPath({ user }) {
    let path = ''
    if (user) {
      path += `/user/${user}`
    }
    return path
  }

  getResourceUrl = (params = {}) =>
    `${this.apiVersion}${this.getPath(params)}/${this.module}`
}
