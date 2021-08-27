import React from 'react'
import { observer, inject } from 'mobx-react'
import { Columns, Column } from '@kube-design/components'

import ClusterTitle from 'components/Clusters/ClusterTitle'

import Tools from './Tools'
import ClusterInfo from './ClusterInfo'
import ClusterNodes from './ClusterNodes'
import ResourcesUsage from './ResourcesUsage'
import KubernetesStatus from './KubernetesStatus'
import ServiceComponents from './ServiceComponents'

@inject('clusterStore')
@observer
export default class Dashboard extends React.Component {
  componentDidMount() {
    this.cluster.fetchVersion(this.props.match.params)
  }

  get cluster() {
    return this.props.clusterStore
  }

  render() {
    const { match } = this.props
    const { detail } = this.cluster

    return (
      <div>
        <ClusterTitle
          className="margin-b12"
          cluster={detail}
          size="large"
          noStatus
        />
        <Columns>
          <Column>
            {globals.app.isMultiCluster && (
              <ClusterInfo cluster={detail} version={this.cluster.version} />
            )}
            <ServiceComponents cluster={match.params.cluster} />
            <ResourcesUsage cluster={match.params.cluster} />
            {globals.app.isPlatformAdmin && (
              <Tools cluster={match.params.cluster} />
            )}
          </Column>
          <Column className="is-narrow is-4">
            <KubernetesStatus cluster={match.params.cluster} />
            <ClusterNodes cluster={match.params.cluster} />
          </Column>
        </Columns>
      </div>
    )
  }
}
