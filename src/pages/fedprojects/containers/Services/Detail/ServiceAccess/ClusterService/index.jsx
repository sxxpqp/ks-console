import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'

import RouterStore from 'stores/router'

import { Panel, Text } from 'components/Base'
import ClusterTitle from 'components/Clusters/ClusterTitle'
import MoreActions from 'components/MoreActions'

import Ports from '../../Ports'

import styles from './index.scss'

@inject('rootStore')
@observer
export default class ClusterService extends Component {
  routerStore = new RouterStore()

  get cluster() {
    return this.props.cluster.name
  }

  componentDidMount() {
    const { namespace } = this.props.detail
    this.routerStore.getGateway({ cluster: this.cluster, namespace })
  }

  getOperations = () => [
    {
      key: 'editGateway',
      icon: 'ip',
      text: t('Edit Internet Access'),
      action: 'edit',
      onClick: () => this.props.updateService(this.cluster),
    },
  ]

  getEnabledOperations = () => {
    const operations = this.getOperations()
    return operations.filter(
      item => !item.action || this.props.enabledActions.includes(item.action)
    )
  }

  renderPorts() {
    const { detail } = this.props
    const gateway = this.routerStore.gateway.data
    return <Ports gateway={gateway} detail={detail} />
  }

  render() {
    const { cluster, detail } = this.props

    return (
      <Panel>
        <div className={styles.header}>
          <div className={styles.cluster}>
            <ClusterTitle
              cluster={cluster}
              theme="light"
              tagClass="float-right"
            />
          </div>
          <Text
            icon="eip-pool"
            title={`${detail.name}.${detail.namespace}.svc`}
            description={t('EIP_POOL_DESC')}
          />
          <Text title={detail.clusterIP} description={t('Virtual IP')} />
          <MoreActions
            className={styles.more}
            options={this.getEnabledOperations()}
          />
        </div>
        <div className={styles.content}>{this.renderPorts()}</div>
      </Panel>
    )
  }
}
