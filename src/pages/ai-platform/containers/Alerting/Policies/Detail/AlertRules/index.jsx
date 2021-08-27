import React from 'react'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import { get, isEmpty } from 'lodash'

import { Panel } from 'components/Base'
import Notification from './Notification'
import Monitoring from './Monitoring'
import RuleItem from './RuleItem'
import Query from './Query'

@inject('detailStore')
@observer
export default class AlertRules extends React.Component {
  get store() {
    return this.props.detailStore
  }

  get module() {
    return this.store.module
  }

  get params() {
    return this.props.match.params
  }

  render() {
    const { detail } = this.store
    const summary = get(detail, 'annotations.summary')
    const message = get(detail, 'annotations.message')
    const kind = get(detail, 'annotations.kind')
    const resources = toJS(detail.resources)
    return (
      <>
        {!isEmpty(detail.rules) && (
          <Panel title={t('Alerting Rules')}>
            {detail.rules.map((item, index) => (
              <RuleItem
                key={index}
                data={item}
                resources={resources}
                kind={kind || 'Node'}
              />
            ))}
          </Panel>
        )}
        {detail.query && (
          <Panel title={t('Rule Expression')}>
            <Query query={detail.query} />
          </Panel>
        )}
        <Panel title={t('Monitoring')}>
          <Monitoring detail={detail} store={this.store} />
        </Panel>
        <Panel title={t('Notification Settings')}>
          <Notification summary={summary} message={message} />
        </Panel>
      </>
    )
  }
}
