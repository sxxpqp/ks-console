import { omit, isEmpty } from 'lodash'
import React from 'react'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import { Panel, Text } from 'components/Base'
import ClusterTitle from 'components/Clusters/ClusterTitle'
import Annotations from 'projects/components/Cards/Annotations'
import RouterStore from 'stores/router'
import Rule from '../Rule'

import styles from './index.scss'

@observer
export default class Item extends React.Component {
  store = new RouterStore()

  componentDidMount() {
    const { cluster, namespace } = this.props
    this.store.getGateway({ cluster: cluster.name, namespace })
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

  renderRules() {
    const { workspace, namespace, detail } = this.props
    const gateway = toJS(this.store.gateway.data)

    if (!detail || isEmpty(detail.rules)) {
      return t('No Data')
    }

    const tls = detail.tls || []

    return (
      <div className={styles.rules}>
        {detail.rules.map(rule => (
          <Rule
            key={rule.host}
            tls={tls}
            rule={rule}
            gateway={gateway}
            prefix={`/${workspace}/federatedprojects/${namespace}`}
          />
        ))}
      </div>
    )
  }

  renderAnnotations() {
    const { detail } = this.props

    if (!detail) {
      return null
    }

    return (
      <Annotations
        data={omit(detail.annotations, ['displayName', 'desc', 'creator'])}
      />
    )
  }

  render() {
    const { cluster } = this.props
    const gateway = toJS(this.store.gateway.data)

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
          {this.renderRules()}
          {this.renderAnnotations()}
        </div>
      </Panel>
    )
  }
}
