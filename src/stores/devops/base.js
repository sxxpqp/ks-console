import { set, get } from 'lodash'
import BaseStore from '../devops'

export default class Base extends BaseStore {
  catchRequestError(method = 'get', ...rest) {
    return request[method](...rest).catch(error => {
      return Promise.reject(error)
    })
  }

  getCrumb = async ({ cluster } = { cluster: '' }) =>
    await this.catchRequestError(
      'get',
      `${this.getBaseUrlV2({ cluster })}crumbissuer`,
      null,
      null,
      () => true
    ).then(result => {
      if (result && result.crumb) {
        globals.user.crumb = result.crumb
      } else {
        globals.user.crumb = null
      }
    })

  handlePostRequest = async function(
    method,
    url,
    params,
    options = {},
    reject
  ) {
    if (!options) {
      options = {}
    }
    const crumb = get(globals, 'user.crumb', '')
    if (!crumb) {
      const match = url.match(/(clusters|klusters)\/([^/]*)\//)
      if (match && match.length === 3) {
        const cluster = match[2]
        await this.getCrumb({ cluster })
      } else {
        await this.getCrumb()
      }
    }
    if (globals.user.crumb) {
      set(options, 'headers.Jenkins-Crumb', globals.user.crumb)
    }

    return this.catchRequestError(method, url, params, options, reject)
  }

  request = {
    post: this.handlePostRequest.bind(this, 'post'),
    put: this.handlePostRequest.bind(this, 'put'),
    patch: this.handlePostRequest.bind(this, 'patch'),
    delete: this.handlePostRequest.bind(this, 'delete'),
    get: this.catchRequestError.bind(this, 'get'),
    defaults: this.catchRequestError.bind(this, 'defaults'),
  }
}
