import React from 'react'
import { Link } from 'react-router-dom'

export default class LinkWithAuth extends React.Component {
  render() {
    const { auth = true, children, ...rest } = this.props

    if (!auth) {
      return children
    }

    return <Link {...rest}>{children}</Link>
  }
}
