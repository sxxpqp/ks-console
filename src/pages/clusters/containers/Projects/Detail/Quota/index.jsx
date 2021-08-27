import React from 'react'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'

import DefaultResource from 'projects/containers/BaseInfo/DefaultResource'
import ResourceQuota from 'projects/containers/BaseInfo/ResourceQuota'

@inject('quotaStore', 'limitRangeStore')
@observer
export default class Quota extends React.Component {
  render() {
    const limitRange = toJS(this.props.limitRangeStore.list.data)[0]
    const quota = toJS(this.props.quotaStore.data)

    return (
      <>
        <DefaultResource detail={limitRange} />
        <ResourceQuota detail={quota} />
      </>
    )
  }
}
