import React from 'react'

import InternetAccess from 'projects/containers/AdvancedSettings/InternetAccess'

export default class Gateway extends React.Component {
  render() {
    return <InternetAccess match={this.props.match} actions={[]} />
  }
}
