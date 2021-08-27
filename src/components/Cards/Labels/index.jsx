import React, { Component } from 'react'
import { Panel, Label } from 'components/Base'
import { isEmpty } from 'lodash'

export default class Labels extends Component {
  render() {
    const { labels } = this.props

    if (isEmpty(labels)) {
      return null
    }

    return (
      <Panel title={t('Labels')}>
        <div>
          {Object.entries(labels).map(([key, value]) => (
            <Label key={key} name={key} value={value} />
          ))}
        </div>
      </Panel>
    )
  }
}
