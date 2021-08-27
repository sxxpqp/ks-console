import { action, observable, extendObservable } from 'mobx'
import { RouterStore } from 'mobx-react-router'
import { parse } from 'qs'
import { getQueryString } from 'utils'

import UserStore from 'stores/user'
import WebSocketStore from 'stores/websocket'
import { get } from 'lodash'

export default class RootStore {
  @observable
  navs = globals.config.navs

  @observable
  showGlobalNav = false

  @observable
  actions = {}

  @observable
  oauthServers = []

  constructor() {
    this.websocket = new WebSocketStore()

    this.user = new UserStore()
    this.routing = new RouterStore()
    this.routing.query = this.query

    global.navigateTo = this.routing.push
  }

  register(name, store) {
    extendObservable(this, { [name]: store })
  }

  query = (params = {}, refresh = false) => {
    const { pathname, search } = this.routing.location
    const currentParams = parse(search.slice(1))

    const newParams = refresh ? params : { ...currentParams, ...params }

    this.routing.push(`${pathname}?${getQueryString(newParams)}`)
  }

  @action
  toggleGlobalNav = () => {
    this.showGlobalNav = !this.showGlobalNav
  }

  @action
  hideGlobalNav = () => {
    this.showGlobalNav = false
  }

  @action
  registerActions = actions => {
    extendObservable(this.actions, actions)
  }

  @action
  triggerAction(id, ...rest) {
    this.actions[id] && this.actions[id].on(...rest)
  }

  login(params) {
    return request.post('login', params)
  }

  @action
  async logout() {
    const res = await request.post('logout')
    const url = get(res, 'data.url')
    if (url) {
      window.location.href = url
    }
  }

  @action
  getRules(params) {
    return this.user.fetchRules({ ...params, name: globals.user.username })
  }
}
