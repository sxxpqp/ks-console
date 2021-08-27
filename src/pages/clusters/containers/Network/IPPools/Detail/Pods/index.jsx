import React from 'react'
import { observer, inject } from 'mobx-react'
import PodsCard from 'components/Cards/Pods'

@inject('detailStore')
@observer
export default class Pods extends React.Component {
  store = this.props.detailStore

  render() {
    const { cluster } = this.props.match.params
    return (
      <PodsCard
        detail={this.store.detail}
        limit={6}
        prefix={`/clusters/${cluster}`}
      />
    )
  }
}
