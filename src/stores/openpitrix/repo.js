import { action, observable } from 'mobx'

import { get } from 'lodash'
import Base from './base'
import List from '../base.list'

export default class Repo extends Base {
  resourceName = 'repos'

  defaultStatus = ['active']

  @observable
  events = new List()

  getUrl = ({ workspace, repo_id, name } = {}) => {
    let prefix = this.baseUrl

    if (workspace) {
      prefix += `/workspaces/${workspace}`
    }

    if (repo_id) {
      return `${prefix}/repos/${repo_id}/${name || ''}`
    }

    return `${prefix}/repos`
  }

  getWatchListUrl = ({ workspace } = {}) =>
    `apis/application.kubesphere.io/v1alpha1/watch/helmrepos?labelSelector=kubesphere.io/workspace=${workspace}`

  @action
  fetchDetail = async ({ workspace, repo_id } = {}) => {
    this.isLoading = true

    const result = await request.get(this.getUrl({ workspace, repo_id }))

    this.detail = result || {}
    this.detail.workspace = workspace
    this.isLoading = false
  }

  @action
  validate({ workspace, ...data }) {
    return request.post(`${this.getUrl({ workspace })}?validate=true`, data)
  }

  @action
  index({ workspace, repo_id }) {
    if (repo_id) {
      return request.post(this.getUrl({ workspace, repo_id, name: 'action' }), {
        action: 'index',
      })
    }
  }

  @action
  async fetchEvents({ workspace, repo_id }) {
    this.events.isLoading = true
    const result = await request.get(
      this.getUrl({ workspace, repo_id, name: 'events' }),
      {}
    )

    this.events.update({
      data: get(result, 'items', []),
      total: get(result, 'total_count', 0),
    })

    this.events.isLoading = false
  }

  @action
  update = async ({ workspace, repo_id, ...data } = {}) => {
    await this.submitting(
      request.patch(this.getUrl({ workspace, repo_id }), data)
    )
  }

  @action
  delete = ({ workspace, repo_id }) =>
    this.submitting(request.delete(this.getUrl({ workspace, repo_id }), {}))

  @action
  setSelectRowKeys(selectedRowKeys) {
    this.list.selectedRowKeys = selectedRowKeys
  }
}
