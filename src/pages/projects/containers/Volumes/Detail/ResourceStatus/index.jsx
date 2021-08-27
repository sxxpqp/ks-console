import React from 'react'
import { observer, inject } from 'mobx-react'
import { get } from 'lodash'

import PodsCard from 'components/Cards/Pods'
import Placement from 'projects/components/Cards/Placement'
import VolumeMonitor from 'stores/monitoring/volume'
import UsageCard from './UsageCard'

import styles from './index.scss'

@inject('detailStore')
@observer
class ResourceStatus extends React.Component {
  get store() {
    return this.props.detailStore
  }

  get module() {
    return this.props.module
  }

  get canViewPods() {
    return globals.app.hasPermission({
      ...this.props.match.params,
      module: 'pods',
      action: 'view',
    })
  }

  get prefix() {
    if (!this.canViewPods) {
      return null
    }

    const { workspace, cluster } = this.props.match.params
    return `${workspace ? `/${workspace}` : ''}/clusters/${cluster}`
  }

  constructor(props) {
    super(props)

    const { cluster, namespace, name } = this.props.match.params

    this.monitor = new VolumeMonitor({
      cluster,
      namespace,
      pvc: name,
    })
  }

  renderPlacement() {
    const { name, namespace } = this.props.match.params
    const { detail } = this.store
    if (detail.isFedManaged) {
      return (
        <Placement
          module={this.store.module}
          name={name}
          namespace={namespace}
        />
      )
    }
    return null
  }

  render() {
    const detail = {
      kind: 'PVC',
      ...get(this.props.match, 'params'),
    }

    return (
      <div className={styles.main}>
        {this.renderPlacement()}
        <UsageCard title={t('Volume')} store={this.monitor} />
        <PodsCard
          title={t('Mounted Pods')}
          detail={detail}
          prefix={this.prefix}
        />
      </div>
    )
  }
}

export default ResourceStatus
