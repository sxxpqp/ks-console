import React, { Component } from 'react'
import { Select } from '@kube-design/components'
import StatusReason from 'clusters/components/StatusReason'

import styles from './index.scss'

export default class ClusterSelect extends Component {
  valueRenderer = option => `${t('Cluster')}: ${option.value}`

  optionRenderer = option => (
    <div>
      <div>{option.value}</div>
      {!option.cluster.isReady && (
        <div>
          <StatusReason data={option.cluster} noTip />
        </div>
      )}
    </div>
  )

  render() {
    const { cluster, clusters, onChange } = this.props

    return (
      <Select
        className={styles.select}
        value={cluster}
        onChange={onChange}
        options={clusters}
        valueRenderer={this.valueRenderer}
        optionRenderer={this.optionRenderer}
      />
    )
  }
}
