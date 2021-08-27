import React, { Component } from 'react'
import { isUndefined, trimEnd } from 'lodash'

export default class UnitWrapper extends Component {
  handleChange = value => {
    const { unit, onChange } = this.props
    onChange(isUndefined(value) ? value : `${value}${unit}`)
  }

  render() {
    const { value, unit, children, ...rest } = this.props

    let formatValue = value
    if (unit) {
      formatValue = trimEnd(value, unit)
    }

    return React.cloneElement(children, {
      ...rest,
      ...children.props,
      value: formatValue,
      onChange: this.handleChange,
    })
  }
}
