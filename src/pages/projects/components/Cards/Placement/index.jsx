import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import { keyBy } from 'lodash'
import { Alert } from '@kube-design/components'
import { Panel } from 'components/Base'
import ClusterTitle from 'components/Clusters/ClusterTitle'

import ClusterStore from 'stores/cluster'
import FederatedStore from 'stores/federated'

import styles from './index.scss'

@observer
export default class Placement extends Component {
  fedStore = new FederatedStore({ module: this.props.module })

  clusterStore = new ClusterStore()

  componentDidMount() {
    const { name, namespace } = this.props
    this.fedStore.fetchDetail({ name, namespace })
    this.clusterStore.fetchList({ limit: -1 })
  }

  render() {
    const { module, name, namespace } = this.props
    const { clusters } = this.fedStore.detail
    const clusterMap = keyBy(this.clusterStore.list.data, 'name')

    if (!clusters) {
      return null
    }

    return (
      <Panel title={t('Project Placement')}>
        <Alert
          type="warning"
          message={t('MULTI_CLUSER_RESOURCE_TIP')}
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
                to={`/clusters/${cluster.name}/projects/${namespace}/${module}/${name}`}
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
}
