import React, { Component } from 'react'
import { get } from 'lodash'
import { inject } from 'mobx-react'
import { Panel, Text } from 'components/Base'

import styles from './index.scss'

@inject('rootStore')
export default class ClusterInfo extends Component {
  handleClick = () => {
    const { cluster, rootStore } = this.props
    rootStore.routing.push(`/clusters/${cluster.name}/visibility`)
  }

  render() {
    const { cluster, version } = this.props
    return (
      <Panel title={t('Cluster Info')}>
        <div className={styles.level}>
          <Text title={cluster.provider} description={t('Provider')} />
          <Text
            title={cluster.kubernetesVersion || version}
            description={t('Kubernetes Version')}
          />
          <Text
            title={get(cluster, 'configz.ksVersion', '-')}
            description={t('KubeSphere Version')}
          />
          <Text
            title={
              cluster.visibility === 'public'
                ? t('VISIBILITY_PUBLIC')
                : t('VISIBILITY_PART')
            }
            description={t('Cluster Visibility')}
            onClick={this.handleClick}
          />
        </div>
      </Panel>
    )
  }
}
