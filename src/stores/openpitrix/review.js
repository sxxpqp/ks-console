import { action, observable } from 'mobx'
import { get, uniq } from 'lodash'

import { getFilterString } from 'utils'
import Base from './base'

export default class Review extends Base {
  resourceName = 'reviews'

  sortKey = 'status_time'

  @observable
  list = {
    data: [],
    apps: [],
    page: 0,
    limit: 10,
    total: 0,
    reverse: false,
    filters: {},
    isLoading: true,
    keyword: '',
    selectedRowKeys: [],
  }

  @action
  handle = async ({ app_id, version_id, ...data } = {}) => {
    const url = this.getUrl({ app_id, version_id, name: 'action' })
    await this.submitting(request.post(url, data))
  }

  @action
  async fetchReviewList({ queryApp, ...rest } = {}) {
    await this.fetchList(rest)
    this.list.isLoading = true
    const appIds = get(this, 'list.data', []).map(app => app.app_id)
    const result = await this.queryApps(uniq(appIds).join('|'))
    Object.assign(this.list, {
      apps: get(result, 'items', []),
      isLoading: false,
    })
  }

  @action
  queryApps = async appIds =>
    await request.get(this.getUrl({ name: 'apps' }), {
      conditions: getFilterString({ app_id: appIds }),
    })
}
