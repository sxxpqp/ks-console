import { action, observable } from 'mobx'

import { STORE_QUERY_STATUS } from 'configs/openpitrix/app'
import Base from 'stores/openpitrix/base'

export default class Store extends Base {
  resourceName = 'apps'

  defaultStatus = STORE_QUERY_STATUS

  @observable
  allApps = []

  defaultRepo = 'repo-helm'

  @action
  adjustCategory = async params =>
    await this.submitting(
      Promise.all(
        this.list.selectedRowKeys.map(appId =>
          request.patch(this.getUrl({ app_id: appId }), { ...params })
        )
      )
    )

  @action
  transfer = async params => {
    return await request.post('/transfer', {
      text: params,
    })
  }
}
