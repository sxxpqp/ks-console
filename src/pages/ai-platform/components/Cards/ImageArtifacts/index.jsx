import React from 'react'
import { observer } from 'mobx-react'

import Base from 'projects/components/Cards/ImageRunRecord'

import RunItem from './Item'

@observer
export default class ImageArtifacts extends Base {
  fetchData = async (params = {}) => {
    const { limit, params: _params } = this.props
    _params.status = 'Successful'
    await this.store.fetchS2IRunRecords({
      limit,
      ..._params,
      ...params,
    })
    this.setAutoRefresh()
  }

  renderItem(run) {
    const { isLoading } = this.store.list

    return (
      <RunItem
        key={run.name}
        runDetail={run}
        loading={isLoading}
        store={this.store}
      />
    )
  }
}
