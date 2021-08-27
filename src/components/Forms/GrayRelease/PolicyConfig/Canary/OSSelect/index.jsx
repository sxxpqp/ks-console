import React from 'react'
import { BoxSelect } from 'components/Inputs'
import { isEmpty } from 'lodash'

export default class OSSelect extends React.Component {
  getValueFromProps = props => {
    if (!props.value) {
      return []
    }

    return props.value.slice(2, props.value.length - 2).split('|')
  }

  handleChange = value => {
    const { onChange } = this.props

    if (!isEmpty(value)) {
      onChange && onChange(`.*${value.join('|')}.*`)
    } else {
      onChange && onChange('')
    }
  }

  render() {
    const value = this.getValueFromProps(this.props)

    return (
      <BoxSelect {...this.props} value={value} onChange={this.handleChange} />
    )
  }
}
