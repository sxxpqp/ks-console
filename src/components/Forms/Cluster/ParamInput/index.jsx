import React, { Component } from 'react'
import { Input, Select } from '@kube-design/components'
import { NumberInput } from 'components/Inputs'

import styles from './index.scss'

export default class ParamInput extends Component {
  handleSelectChange = value => {
    const { name, onChange } = this.props
    onChange(value, name)
  }

  handleNumberChange = value => {
    const { name, onChange } = this.props
    onChange(value, name)
  }

  handleInputChange = e => {
    const { name, onChange } = this.props
    onChange(e.target.value, name)
  }

  render() {
    const { param, ...rest } = this.props

    if (param.options) {
      const options = param.options.map(item => ({ label: item, value: item }))
      return (
        <Select
          options={options}
          {...rest}
          onChange={this.handleSelectChange}
        />
      )
    }

    if (param.type === 'integer') {
      return (
        <NumberInput
          className={styles.number}
          min={param.min}
          unit={param.unit}
          {...rest}
          onChange={this.handleNumberChange}
          showUnit
        />
      )
    }

    return <Input {...rest} onChange={this.handleInputChange} />
  }
}
