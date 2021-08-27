import React from 'react'
import { observer, inject } from 'mobx-react'

import { Panel, CodeEditor } from 'components/Base'

import styles from './index.scss'

@inject('rootStore', 'detailStore')
@observer
export default class AppConfig extends React.Component {
  get store() {
    return this.props.detailStore
  }

  render() {
    const { isLoading, detail } = this.store

    return (
      <Panel title={t('App Config')} loading={isLoading}>
        <CodeEditor className={styles.yaml} value={detail.env || ''} />
      </Panel>
    )
  }
}
