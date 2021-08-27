import React from 'react'
import { inject, observer } from 'mobx-react'

import Components from './Components'

@inject('detailStore')
@observer
export default class AppComponents extends React.Component {
  constructor(props) {
    super(props)

    this.store = props.detailStore
  }

  render() {
    const { workspace } = this.props.match.params
    const { clusters, namespace } = this.store.detail

    return clusters.map(cluster => (
      <Components
        key={cluster.name}
        cluster={cluster.name}
        namespace={namespace}
        workspace={workspace}
        detail={this.store.detail}
      />
    ))
  }
}
