import { get } from 'lodash'
import React, { Component } from 'react'
import { safeAtob, safeBtoa } from 'utils/base64'

export default class Base64Wrapper extends Component {
  handleChange = e => {
    const value = get(e, 'target.value', e)
    const { onChange } = this.props
    return onChange(safeBtoa(value))
  }

  render() {
    const { name, children, value } = this.props
    const node = React.cloneElement(children, {
      name,
      value: safeAtob(value || ''),
      onChange: this.handleChange,
    })
    return node
  }
}
