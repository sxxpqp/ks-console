import React from 'react'
import { observer, inject } from 'mobx-react'
import { Columns, Column } from '@kube-design/components'
import { get } from 'lodash'

import BaseInfo from './BaseInfo'
import ResourceUsage from './ResourceUsage'
import UsageRanking from './UsageRanking'
import LimitRange from './LimitRange'
import Help from './Help'

@inject('rootStore', 'projectStore')
@observer
export default class Overview extends React.Component {
  state = {
    cluster: get(this.project, 'detail.clusters[0].name'),
  }

  get routing() {
    return this.props.rootStore.routing
  }

  get namespace() {
    return get(this.props.match, 'params.namespace')
  }

  get workspace() {
    return get(this.props.match, 'params.workspace')
  }

  get project() {
    return this.props.projectStore
  }

  get clusters() {
    return this.project.detail.clusters.map(cluster => ({
      label: cluster.name,
      value: cluster.name,
    }))
  }

  handleClusterChange = cluster => {
    this.setState({ cluster })
  }

  get enabledActions() {
    return globals.app.getActions({
      module: 'project-settings',
      ...this.props.match.params,
      project: this.namespace,
    })
  }

  render() {
    const { detail } = this.project

    const clusterProps = {
      cluster: this.state.cluster,
      clusters: this.clusters,
      onClusterChange: this.handleClusterChange,
    }

    return (
      <div>
        <div className="h3 margin-b12">{t('Overview')}</div>
        <Columns>
          <Column className="is-8">
            <BaseInfo
              className="margin-b12"
              detail={detail}
              workspace={this.workspace}
            />
            {this.enabledActions.includes('edit') && (
              <LimitRange match={this.props.match} />
            )}
            <ResourceUsage match={this.props.match} {...clusterProps} />
          </Column>
          <Column className="is-4">
            <Help className="margin-b12" />
            <UsageRanking match={this.props.match} {...clusterProps} />
          </Column>
        </Columns>
      </div>
    )
  }
}
