import React, { Component } from 'react'

import { keyBy, isEmpty } from 'lodash'
import { inject, observer } from 'mobx-react'
import { joinSelector } from 'utils'
import { Loading } from '@kube-design/components'
import { Panel, Text } from 'components/Base'
import ClusterTitle from 'components/Clusters/ClusterTitle'

import RouterStore from 'stores/router'

import IngressCard from './IngressCard'

import styles from './index.scss'

@inject('projectStore')
@observer
export default class Components extends Component {
  routerStore = new RouterStore()

  get prefix() {
    const { workspace, namespace } = this.props
    return `/${workspace}/federatedprojects/${namespace}`
  }

  componentDidMount() {
    this.getData()
  }

  getData() {
    const { cluster, namespace, detail } = this.props
    const { selector } = detail
    if (selector) {
      const params = {
        cluster,
        namespace,
        labelSelector: joinSelector(selector),
      }

      this.routerStore.fetchListByK8s(params)
    }
    this.routerStore.getGateway({
      cluster,
      ...detail,
    })
  }

  getNodePorts(gateway) {
    if (!gateway.ports) {
      return '-'
    }

    return gateway.ports.map(port => `${port.name}:${port.nodePort}`).join('; ')
  }

  getExternalIP(gateway) {
    let ip = '-'

    if (!isEmpty(gateway.loadBalancerIngress)) {
      ip = gateway.loadBalancerIngress.join('; ')
    } else if (!isEmpty(gateway.externalIPs)) {
      ip = gateway.externalIPs.join('; ')
    }

    return ip || '-'
  }

  render() {
    const { cluster } = this.props
    const { data, isLoading } = this.routerStore.list
    const gateway = this.routerStore.gateway.data
    const clusters = keyBy(this.props.projectStore.detail.clusters, 'name')

    return (
      <Panel>
        <div className={styles.header}>
          <div className={styles.cluster}>
            <ClusterTitle
              cluster={clusters[cluster]}
              theme="light"
              tagClass="float-right"
            />
          </div>
          <Text
            icon="eip-pool"
            title={gateway.type}
            description={t('Gateway Type')}
          />
          {gateway.type === 'NodePort' ? (
            <>
              <Text
                title={gateway.loadBalancerIngress || '-'}
                description={t('Gateway IP')}
              />
              <Text
                title={this.getNodePorts(gateway)}
                description={t('Node Port')}
              />
            </>
          ) : (
            <Text
              title={this.getExternalIP(gateway)}
              description={t('External Address')}
            />
          )}
        </div>
        <div className={styles.content}>
          <Loading spinning={isLoading}>
            <>
              {data.map(item => (
                <IngressCard
                  key={item.name}
                  detail={item}
                  prefix={this.prefix}
                  gateway={gateway}
                />
              ))}
            </>
          </Loading>
        </div>
      </Panel>
    )
  }
}
