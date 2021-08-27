import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { get } from 'lodash'
import { Button } from '@kube-design/components'
import { Text, Panel } from 'components/Base'
import FederatedStore from 'stores/federated'
import { trigger } from 'utils/action'

import styles from './index.scss'

@inject('rootStore', 'projectStore')
@observer
@trigger
export default class LimitRange extends Component {
  state = {
    showTip: false,
  }

  store = new FederatedStore({ module: 'limitranges' })

  componentDidMount() {
    const { namespace } = this.params
    this.store.fetchListByK8s({ namespace }).then(() => {
      const { total } = this.store.list
      this.setState({ showTip: total === 0 })
    })
  }

  get params() {
    return get(this.props.match, 'params', {})
  }

  showSetting = () => {
    const limitRanges = this.store.list.data
    this.trigger('project.default.resource', {
      ...this.params,
      detail: limitRanges[0],
      isFederated: true,
      projectDetail: this.props.projectStore.detail,
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
          title={t('Resource Default Request Not Set')}
          description={t('WHAT_IS_LIMIT_RANGE_A')}
        />
        <Button type="control" onClick={this.showSetting}>
          {t('Set')}
        </Button>
      </Panel>
    )
  }
}
