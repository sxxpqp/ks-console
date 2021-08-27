import React from 'react'
import { inject, observer } from 'mobx-react'
import { get } from 'lodash'

import { Card, Empty } from 'components/Base'
import ContainerLog from 'components/Cards/ContainerLog'

@inject('detailStore')
@observer
class Logs extends React.Component {
  get store() {
    return this.props.detailStore
  }

  render() {
    if (!get(this.store, 'detail.containerID')) {
      return (
        <Card>
          <Empty desc={'CONTAINER_REAL_TIME_LOGS_UNSUPPORTED_TIPS'} />
        </Card>
      )
    }

    return <ContainerLog {...this.props.match.params} />
  }
}

export default Logs
