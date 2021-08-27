import React from 'react'
import { get, debounce } from 'lodash'

export default class FormItemContainer extends React.Component {
  state = {
    value: this.props.value,
  }

  handleChange = newValue => {
    const value = get(newValue, 'currentTarget.value', newValue)
    this.setState({ value })

    this.change(value)
  }

  change = debounce(value => {
    this.props.onChange(value)
  }, this.props.debounce)

  render() {
    const { children, value, onChange, ...props } = this.props
    return children({
      ...props,
      value: this.state.value,
      onChange: this.handleChange,
    })
  }
}
