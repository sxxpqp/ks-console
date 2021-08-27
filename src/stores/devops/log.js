import { get } from 'lodash'
import { action, observable } from 'mobx'

import BaseStore from './base'

export default class PipelineRunStore extends BaseStore {
  @observable stepLogData = {
    log: '',
    start: 0,
    hasMore: false,
  }

  async getStepLog({ devops, cluster, name, branch, runId, nodeId, stepId }) {
    const result = await request.defaults({
      url: `${this.getDevopsUrlV2({
        cluster,
      })}${devops}/pipelines/${decodeURIComponent(name)}${
        branch ? `/branches/${encodeURIComponent(branch)}` : ''
      }/runs/${runId}/nodes/${nodeId}/steps/${stepId}/log/?start=${this
        .stepLogData.start || 0}`,
      handler: resp => {
        if (resp.status === 200) {
          return resp.text().then(res => ({ data: res, headers: resp.headers }))
        }
      },
    })
    const prevLog = this.stepLogData.log
    this.stepLogData = {
      log: prevLog + get(result, 'data', ''),
      start: result.headers.get('x-text-size'),
      hasMore: Boolean(result.headers.get('x-more-data')),
    }
  }

  @action
  handleResetStepLog = () => {
    this.stepLogData = {
      log: '',
      start: 0,
      hasMore: false,
    }
  }
}
