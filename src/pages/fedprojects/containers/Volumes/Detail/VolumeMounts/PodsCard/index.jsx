import React, { Component } from 'react'
import { Panel } from 'components/Base'
import PodsCard from 'components/Cards/Pods'
import ClusterTitle from 'components/Clusters/ClusterTitle'

import styles from './index.scss'

export default class PodsCardWrapper extends Component {
  get prefix() {
    return `/${this.props.match.params.workspace}`
  }

  render() {
    const { cluster } = this.props
    const { namespace, workspace, name } = this.props.match.params
    const detail = {
      kind: 'PVC',
      cluster: cluster.name,
      namespace,
      workspace,
      name,
    }

    return (
      <Panel>
        <div className={styles.cluster}>
          <ClusterTitle
            cluster={cluster}
            theme="light"
            tagClass="float-right"
          />
        </div>
        <div className={styles.content}>
          <PodsCard
            detail={detail}
            prefix={this.prefix}
            hideHeader
            hideFooter
            noWrapper
          />
        </div>
      </Panel>
    )
  }
}
