import React, { Component } from 'react'
import { Select } from '@kube-design/components'

import { isEmpty, get, isEqual } from 'lodash'
import { METER_RESOURCE_TITLE } from '../../constats'

export default class ResourceList extends Component {
  state = {
    value: 'cpu',
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.activeName !== prevProps.activeName ||
      !isEqual(this.props.selectOptions, prevProps.selectOptions)
    ) {
      const option = this.getOptions()
      this.setState({ value: get(option, '[0].value') })
    }
  }

  getOptions = () => {
    const { selectOptions } = this.props
    if (isEmpty(selectOptions)) {
      return []
    }

    const options = Object.keys(selectOptions).map(key => {
      return {
        label: `${t(METER_RESOURCE_TITLE[key])} ${t('Consumption')}`,
        value: key,
      }
    })
    return options
  }

  handleSelect = value => {
    this.setState({ value })
    this.props.getResourceMeterData(value)
  }

  render() {
    const { value } = this.state

    return (
      <div>
        <Select
          onChange={this.handleSelect}
          options={this.getOptions()}
          width="100%"
          style={{ marginBottom: '20px', width: '100%' }}
          value={value}
        />
      </div>
    )
  }
}
