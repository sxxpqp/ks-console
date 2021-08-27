import React from 'react'
import { RadioGroup } from '@kube-design/components'

import ServiceMonitor from './ServiceMonitor'
import WorkloadMonitor from './WorkloadMonitor'

export default class Monitors extends React.Component {
  constructor(props) {
    super(props)
    this.state = { type: 'service' }
  }

  handleTypeChange = type => {
    this.setState({ type })
  }

  get types() {
    return [
      {
        label: t('Service'),
        value: 'service',
      },
      {
        label: t('Workload'),
        value: 'workload',
      },
    ]
  }

  render() {
    const { type } = this.state
    return (
      <div>
        <RadioGroup
          mode="button"
          buttonWidth={50}
          value={this.state.type}
          onChange={this.handleTypeChange}
          options={this.types}
        />
        {type === 'service' ? (
          <ServiceMonitor {...this.props} />
        ) : (
          <WorkloadMonitor {...this.props} />
        )}
      </div>
    )
  }
}
