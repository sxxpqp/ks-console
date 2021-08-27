import { action } from 'mobx'

import { DEFAULT_QUERY_STATUS } from 'configs/openpitrix/version'

import Base from './base'

export default class Version extends Base {
  resourceName = 'versions'

  sortKey = 'sequence'

  defaultStatus = DEFAULT_QUERY_STATUS

  // data action value is: submit、cancel、release、suspend、recover
  @action
  handle = async ({ app_id, version_id, workspace, ...data } = {}) => {
    const url = this.getUrl({ app_id, version_id, workspace, name: 'action' })
    return await this.submitting(request.post(url, data))
  }
}
