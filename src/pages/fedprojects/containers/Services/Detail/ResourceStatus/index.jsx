import React from 'react'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import { get, keyBy } from 'lodash'

import WorkloadStore from 'stores/workload'
import FedStore from 'stores/federated'

import PodsCard from 'components/Cards/Pods'
import ClusterWorkloadStatus from 'fedprojects/components/ClusterWorkloadStatus'

import styles from './index.scss'

@inject('detailStore', 'projectStore')
@observer
export default class ResourceStatus extends React.Component {
  constructor(props) {
    super(props)

    this.store = props.detailStore

    this.state = {
      workloadExist: true,
    }

    this.workloadName = get(
      this.store.detail.annotations,
      '["kubesphere.io/workloadName"]'
    )

    const workloadModule = get(
      this.store.detail.annotations,
      '["kubesphere.io/workloadModule"]',
      'deployments'
    )

    this.workloadStore = new FedStore(new WorkloadStore(workloadModule))
  }

  componentDidMount() {
    this.fetchData()
  }

  get enabledActions() {
    return globals.app.getActions({
      module: this.store.module,
      project: this.props.match.params.namespace,
    })
  }

  get prefix() {
    const { workspace } = this.props.match.params
    return workspace ? `/${workspace}` : ''
  }

  fetchData = async () => {
    const { namespace } = this.props.match.params
    const name = this.workloadName

    const clusters = this.store.detail.clusters.map(item => item.name)
    const result = await this.workloadStore.checkName({ name, namespace })
    if (result.exist) {
      this.workloadStore.fetchDetail({ name, namespace })
      this.workloadStore.fetchResources({ name, namespace, clusters })
    } else {
      this.setState({ workloadExist: false })
    }
  }

  renderReplicaInfo() {
    const { clusters } = this.store.detail || {}
    const { detail, resources, isResourcesLoading } = this.workloadStore
    const clustersDetail = keyBy(
      this.props.projectStore.detail.clusters,
      'name'
    )

    return (
      <ClusterWorkloadStatus
        module={this.workloadStore.module}
        store={this.workloadStore}
        detail={detail}
        resources={resources}
        clusters={clusters}
        clustersDetail={clustersDetail}
        isLoading={isResourcesLoading}
        canEdit={this.enabledActions.includes('edit')}
      />
    )
  }

  renderWorkloadPods() {
    const { resources } = this.workloadStore
    const clusters = this.store.detail.clusters.map(item => item.name)

    return (
      <PodsCard
        prefix={this.prefix}
        details={toJS(resources)}
        clusters={clusters}
        isFederated
      />
    )
  }

  renderPods() {
    const { resources, isResourcesLoading } = this.store

    const clusters = this.store.detail.clusters.map(item => item.name)

    return (
      <PodsCard
        prefix={this.prefix}
        details={toJS(resources)}
        clusters={clusters}
        isLoading={isResourcesLoading}
        isFederated
      />
    )
  }

  renderContent() {
    if (!this.workloadName || !this.state.workloadExist) {
      return this.renderPods()
    }

    return (
      <div>
        {this.renderReplicaInfo()}
        {this.renderWorkloadPods()}
      </div>
    )
  }

  render() {
    return <div className={styles.main}>{this.renderContent()}</div>
  }
}
