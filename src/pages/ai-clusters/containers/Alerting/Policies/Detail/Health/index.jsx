import React, { Component } from 'react'
import { get } from 'lodash'
import { Tooltip, Icon } from '@kube-design/components'
import { Status } from 'components/Base'

export default class Health extends Component {
  render() {
    const { health } = this.props.detail
    const message = get(this.props.detail, 'lastError.description')
    return (
      <div>
        <Status
          type={health}
          name={t(`ALERT_RULE_HEALTH_${health.toUpperCase()}`)}
        />
        {health === 'err' && message && (
          <Tooltip content={message}>
            <Icon name="question" />
          </Tooltip>
        )}
      </div>
    )
  }
}
