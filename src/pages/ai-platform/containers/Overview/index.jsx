import React from 'react'
import { observer, inject } from 'mobx-react'
import { Columns, Column } from '@kube-design/components'
import { get } from 'lodash'

// import BaseInfo from './BaseInfo'
import Applications from './Applications'
import ResourceUsage from './ResourceUsage'
import UsageRanking from './UsageRanking'
// import Help from './Help'
// import Quota from './Quota'
// import LimitRange from './LimitRange'

@inject('rootStore', 'projectStore')
@observer
export default class Overview extends React.Component {
  get routing() {
    return this.props.rootStore.routing
  }

  get namespace() {
    return get(this.props.match, 'params.namespace')
  }

  get project() {
    return this.props.projectStore
  }

  get enabledActions() {
    return globals.app.getActions({
      module: 'project-settings',
      ...this.props.match.params,
      project: this.namespace,
    })
  }

  render() {
    // const { detail } = this.project
    return (
      <div>
        <div className="h3 margin-b12">{t('Overview')}</div>
        <Columns>
          <Column className="is-8">
            {/* <BaseInfo className="margin-b12" detail={detail} />
            {this.enabledActions.includes('edit') && (
              <>
                <Quota match={this.props.match} />
                <LimitRange match={this.props.match} />
              </>
            )} */}
            {globals.app.hasKSModule('openpitrix') && (
              <Applications className="margin-b12" match={this.props.match} />
            )}
            <ResourceUsage match={this.props.match} />
          </Column>
          <Column className="is-4">
            {/* <Help className="margin-b12" /> */}
            <UsageRanking match={this.props.match} />
          </Column>
        </Columns>
      </div>
    )
  }
}
