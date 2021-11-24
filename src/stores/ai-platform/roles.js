import { getRoles } from 'api/users'
import { observable, action } from 'mobx'

export default class RoleStore {
  @observable
  roles = []

  @action
  getData() {
    return getRoles().then(res => {
      if (res.code === 200) {
        this.roles = res.data
      }
    })
  }
}
