import React from 'react'
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { keyBy } from 'lodash'
import { Alert } from '@kube-design/components'
import { Panel } from 'components/Base'
import ClusterTitle from 'components/Clusters/ClusterTitle'
import ResourceUsage from 'projects/containers/Overview/ResourceUsage'

import ClusterStore from 'stores/cluster'
import FederatedStore from 'stores/federated'

import styles from './index.scss'

@inject('detailStore')
@observer
export default class Overview extends React.Component {
  fedStore = new FederatedStore({ module: 'namespaces' })

  clusterStore = new ClusterStore()

  get isFedManaged() {
    return this.props.detailStore.detail.isFedManaged
  }

  componentDidMount() {
    if (this.isFedManaged) {
      const { name } = this.props.detailStore.detail
      this.fedStore.fetchDetail({ name, namespace: name })
      this.clusterStore.fetchList({ limit: -1 })
    }
  }

  renderPlacement() {
    const { clusters = [], name } = this.fedStore.detail
    const clusterMap = keyBy(this.clusterStore.list.data, 'name')
    return (
      <Panel title={t('Project Placement')}>
        <Alert
          type="warning"
          message={t('MULTI_CLUSER_PROJECT_TIP')}
          hideIcon
        />
        <div className={styles.clusters}>
          {clusters.map(cluster => {
            if (!clusterMap[cluster.name]) {
              return null
            }

            return (
              <Link
                key={cluster.name}
                className={styles.cluster}
                to={`/clusters/${cluster.name}/projects/${name}`}
              >
                <ClusterTitle
                  cluster={clusterMap[cluster.name]}
                  theme="light"
                  tagClass="float-right"
                />
              </Link>
            )
          })}
        </div>
      </Panel>
    )
  }

  render() {
    const { detail } = this.props.detailStore
    return (
      <>
        {this.isFedManaged && this.renderPlacement()}
        <ResourceUsage match={this.props.match} workspace={detail.workspace} />
      </>
    )
  }
}
