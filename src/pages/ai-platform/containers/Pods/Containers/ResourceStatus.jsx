import React from 'react'
import { toJS } from 'mobx'
import { inject, observer } from 'mobx-react'

import VolumesCard from 'components/Cards/Volumes'
import ProbeCard from 'projects/components/Cards/Probe'

@inject('detailStore')
@observer
class ContainersResourceStatus extends React.Component {
  get store() {
    return this.props.detailStore
  }

  renderVolumes() {
    const containers = [toJS(this.store.detail)]
    const volumes = toJS(this.store.volumes)

    return (
      <VolumesCard
        title={t('Storage Device')}
        volumes={volumes}
        containers={containers}
        loading={this.store.isLoading}
        match={this.props.match}
      />
    )
  }

  renderProb() {
    const { livenessProbe, readinessProbe } = toJS(this.store.detail)

    if (!livenessProbe && !readinessProbe) {
      return null
    }

    return <ProbeCard detail={this.store.detail} />
  }

  render() {
    return (
      <div>
        {this.renderProb()}
        {this.renderVolumes()}
      </div>
    )
  }
}

export default ContainersResourceStatus
