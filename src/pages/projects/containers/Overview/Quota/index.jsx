import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { get } from 'lodash'

import { Button } from '@kube-design/components'
import { Text, Panel } from 'components/Base'
import QuotaStore from 'stores/quota'
import { trigger } from 'utils/action'

import styles from './index.scss'

@inject('rootStore', 'projectStore')
@observer
@trigger
export default class Quota extends Component {
  state = {
    showTip: false,
  }

  store = new QuotaStore()

  componentDidMount() {
    this.store.fetchListByK8s(this.params).then(() => {
      const { total } = this.store.list
      this.setState({ showTip: total === 0 })
    })
  }

  get params() {
    return get(this.props.match, 'params', {})
  }

  showSetting = () => {
    this.trigger('project.quota.edit', {
      detail: this.props.projectStore.detail,
      success: () => this.setState({ showTip: false }),
    })
  }

  render() {
    const { showTip } = this.state

    if (!showTip) {
      return null
    }

    return (
      <Panel className={styles.wrapper}>
        <Text
          className={styles.text}
          icon="exclamation"
          title={t('Project Quota Not Set')}
          description={t('HOW_TO_USE_QUOTA_A')}
        />
        <Button type="control" onClick={this.showSetting}>
          {t('Set')}
        </Button>
      </Panel>
    )
  }
}
