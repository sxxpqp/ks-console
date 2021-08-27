import React from 'react'
import { get } from 'lodash'
import { observer, inject } from 'mobx-react'

import ImageBuilderLastRun from 'projects/components/Cards/ImageBuilderLastRun'
import RunRecords from 'projects/components/Cards/ImageRunRecord'
import styles from './index.scss'

@inject('detailStore', 's2iRunStore')
@observer
class BuildRecords extends React.Component {
  get store() {
    return this.props.detailStore
  }

  get isB2i() {
    return get(this.store.detail, 'spec.config.isBinaryURL')
  }

  render() {
    const { params } = this.props.match
    const { runDetail } = this.props.s2iRunStore

    return (
      <React.Fragment>
        <div className={styles.title}>{t('Last build environment')}</div>
        <div className={styles.card}>
          <ImageBuilderLastRun
            isB2i={this.isB2i}
            runDetail={runDetail}
            params={params}
          />
        </div>
        <div className={styles.title}>{t('Job Records')}</div>
        <div className={styles.card}>
          <RunRecords isB2i={this.isB2i} params={params} />
        </div>
      </React.Fragment>
    )
  }
}

export default BuildRecords
