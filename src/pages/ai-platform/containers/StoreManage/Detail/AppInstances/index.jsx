import React from 'react'

import InstanceList from 'apps/components/Lists/InstanceList'

export default class AppInstances extends React.Component {
  render() {
    const { appId } = this.props.match.params
    return <InstanceList appId={appId} />
  }
}
