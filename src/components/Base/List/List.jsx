import React from 'react'

export default class List extends React.Component {
  render() {
    const { children, className } = this.props
    return <div className={className}>{children}</div>
  }
}
