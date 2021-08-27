import React, { Component } from 'react'

import { keyBy, isEmpty } from 'lodash'
import { inject, observer } from 'mobx-react'
import { joinSelector } from 'utils'
import { Loading } from '@kube-design/components'
import { Panel } from 'components/Base'
import ClusterTitle from 'components/Clusters/ClusterTitle'

import ServiceStore from 'stores/service'

import ServiceCard from './ServiceCard'

import styles from './index.scss'

@inject('projectStore')
@observer
export default class Components extends Component {
  serviceStore = new ServiceStore()

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

      this.serviceStore.fetchListByK8s(params)
    }
  }

  renderServices() {
    const { data } = this.serviceStore.list
    if (isEmpty(data)) {
      return <div className={styles.empty}>{t('No Components')}</div>
    }

    return (
      <div>
        {data.map(item => (
          <ServiceCard key={item.name} data={item} prefix={this.prefix} />
        ))}
      </div>
    )
  }

  render() {
    const { cluster } = this.props
    const { isLoading } = this.serviceStore.list
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
        </div>
        <div className={styles.content}>
          <Loading spinning={isLoading}>{this.renderServices()}</Loading>
        </div>
      </Panel>
    )
  }
}
