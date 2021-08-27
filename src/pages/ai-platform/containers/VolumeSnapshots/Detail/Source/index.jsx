import React, { Component } from 'react'
import { Panel } from 'components/Base'
import { Icon } from '@kube-design/components'
import { inject } from 'mobx-react'

import styles from './index.scss'

@inject('detailStore')
export default class VolumeSnapshotSource extends Component {
  render() {
    const { detailStore } = this.props
    const { detail } = detailStore

    const { snapshotClassName, snapshotSourceName } = detail

    return (
      <>
        <Panel title={t('DATA_SOURCE')}>
          <div className={styles.wrapper}>
            <div className={styles.icon}>
              <Icon name={'storage'} size={40} />
            </div>
            <div>
              <Attr title={snapshotSourceName} value={t('Name')} />
            </div>
            <div>
              <Attr title={snapshotClassName} value={t('Storage Class')} />
            </div>
            <div />
          </div>
        </Panel>
      </>
    )
  }
}

function Attr({ title, value }) {
  return (
    <div className={styles.attr}>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  )
}
