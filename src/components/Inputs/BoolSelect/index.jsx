import React from 'react'
import { Select } from '@kube-design/components'

const BOOLEAN_OPTIONS = [
  { label: 'true', value: 'true' },
  { label: 'false', value: 'false' },
]

export default class BoolSelect extends React.Component {
  static defaultProps = {
    options: BOOLEAN_OPTIONS,
  }

  handleChange = (value, option) => {
    const { onChange } = this.props
    onChange && onChange(value && value === 'true', option)
  }

  render() {
    const { value, onChange, ...rest } = this.props
    return (
      <Select value={String(value)} onChange={this.handleChange} {...rest} />
    )
  }
}
