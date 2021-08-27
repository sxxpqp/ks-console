import React, { Component } from 'react'
import { Panel } from 'components/Base'
import NodesStatus from './NodesStatus'
import NodesTop5 from './NodesTop5'

import styles from './index.scss'

export default class ClusterNodes extends Component {
  render() {
    return (
      <Panel title="选择资源节点">
        <div className={styles.status}>
          <NodesStatus />
        </div>
        <NodesTop5 {...this.props} />
      </Panel>
    )
  }
}
