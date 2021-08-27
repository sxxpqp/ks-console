import React from 'react'
import { observer } from 'mobx-react'

import ClusterDetail from './Cluster'

import { LEVEL_CONFIG } from '../constats'

@observer
export default class Details extends React.Component {
  render() {
    const { type, handleBack } = this.props

    return (
      <ClusterDetail
        level={LEVEL_CONFIG[type]}
        meterType={type}
        handleBack={handleBack}
      />
    )
  }
}
