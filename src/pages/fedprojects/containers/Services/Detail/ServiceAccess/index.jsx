import React from 'react'
import { keyBy } from 'lodash'
import { observer, inject } from 'mobx-react'
import { Loading } from '@kube-design/components'
import { trigger } from 'utils/action'

import { toJS } from 'mobx'
import ClusterService from './ClusterService'

import styles from './index.scss'

@inject('rootStore', 'detailStore', 'projectStore')
@observer
@trigger
export default class ServiceAccess extends React.Component {
  store = this.props.detailStore

  get enabledActions() {
    const { namespace: project, ...rest } = this.props.match.params
    return globals.app.getActions({
      module: 'services',
      ...rest,
      project,
    })
  }

  fetchData = () => {
    const { params } = this.props.match
    const clusters = this.store.detail.clusters.map(item => item.name)
    this.store.fetchDetail(params)
    this.store.fetchResources({
      ...params,
      clusters,
    })
  }

  handleUpdateService = cluster => {
    const { detail, resources } = this.store
    this.trigger('fedservice.gateway.edit', {
      cluster,
      detail: toJS(detail),
      resources: toJS(resources),
      success: this.fetchData,
    })
  }

  renderServiceAccess() {
    const { resources = [], isResourcesLoading } = this.store
    const clusters = keyBy(this.props.projectStore.detail.clusters, 'name')

    return (
      <Loading spinning={isResourcesLoading}>
        <div>
          <div className={styles.title}>{t('Service Access')}</div>
          {Object.keys(resources).map(cluster => (
            <ClusterService
              key={cluster}
              store={this.store}
              detail={resources[cluster]}
              cluster={clusters[cluster]}
              enabledActions={this.enabledActions}
              updateService={this.handleUpdateService}
            />
          ))}
        </div>
      </Loading>
    )
  }

  render() {
    return <div className={styles.main}>{this.renderServiceAccess()}</div>
  }
}
