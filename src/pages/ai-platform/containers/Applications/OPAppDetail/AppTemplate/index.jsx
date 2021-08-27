import React from 'react'
import { isEmpty } from 'lodash'
import { when, toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import { Tabs } from '@kube-design/components'

import AppVersionStore from 'stores/openpitrix/version'
import AppFileStore from 'stores/openpitrix/file'

import { Card } from 'components/Base'
import Markdown from 'components/Base/Markdown'
import TextPreview from 'components/TextPreview'

import styles from './index.scss'

const { TabPanel } = Tabs

@inject('detailStore')
@observer
export default class AppTemplate extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      tab: 'readme',
    }

    this.store = props.detailStore

    this.appVersionStore = new AppVersionStore()
    this.appFileStore = new AppFileStore()

    when(
      () => !isEmpty(this.store.detail),
      () => this.getData()
    )
  }

  getData() {
    const { detail } = toJS(this.store)
    const { app_id, version_id } = detail

    this.appVersionStore.fetchList({
      app_id,
      status: 'active',
    })

    this.appFileStore.fetch({ app_id, version_id })
  }

  handleTabChange = tab => {
    this.setState({ tab })
  }

  renderReadme() {
    const files = this.appFileStore.files

    const readme = files['README.md']
    if (readme || this.appFileStore.isLoading) {
      return (
        <Markdown source={files['README.md']} className={styles.markdown} />
      )
    }

    return <p>{t('The app has no documentation.')}</p>
  }

  renderSettings() {
    const files = this.appFileStore.files
    return <TextPreview files={files} />
  }

  render() {
    const { tab } = this.state
    return (
      <Card title={t('App Description')} className={styles.wrapper}>
        <Tabs type="button" activeName={tab} onChange={this.handleTabChange}>
          <TabPanel label={t('App Description')} name="readme">
            {this.renderReadme()}
          </TabPanel>
          <TabPanel label={t('Configuration Files')} name="settings">
            {this.renderSettings()}
          </TabPanel>
        </Tabs>
      </Card>
    )
  }
}
