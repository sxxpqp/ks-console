import React from 'react'
import { PropTypes } from 'prop-types'
import { noop, isEqual } from 'lodash'
import { Toggle } from '@kube-design/components'

export default class ToggleField extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    onText: PropTypes.string,
    offText: PropTypes.string,
    value: PropTypes.bool,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    onChange: noop,
  }

  constructor(props) {
    super(props)
    this.state = {
      value: props.value || false,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { value } = prevState
    if ('value' in nextProps && !isEqual(nextProps.value, value)) {
      return { value: nextProps.value }
    }
    return null
  }

  handleChange = value => {
    const { onChange } = this.props
    this.setState({ value })
    if (onChange !== noop) {
      onChange(value)
    }
  }

  render() {
    const { name, onText, offText, ...rest } = this.props
    const { value } = this.state

    return (
      <Toggle
        {...rest}
        name={name}
        onText={onText}
        offText={offText}
        checked={value}
        onChange={this.handleChange}
      />
    )
  }
}
