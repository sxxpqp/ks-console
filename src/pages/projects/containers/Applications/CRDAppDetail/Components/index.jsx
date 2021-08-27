import React from 'react'
import { observer, inject } from 'mobx-react'
import Services from 'projects/components/Cards/Services'
import Workloads from 'projects/components/Cards/Workloads'
import Ingresses from 'projects/components/Cards/Ingresses'
import Volumes from 'projects/components/Cards/Volumes'

import styles from './index.scss'

@inject('detailStore')
@observer
export default class ResourceStatus extends React.Component {
  constructor(props) {
    super(props)

    this.store = props.detailStore
    this.module = props.module
  }

  get prefix() {
    const { workspace, cluster, namespace } = this.props.match.params
    return `/${workspace}/clusters/${cluster}/projects/${namespace}`
  }

  render() {
    const { cluster, namespace, selector } = this.store.detail

    return (
      <div className={styles.main}>
        <Ingresses
          selector={selector}
          cluster={cluster}
          namespace={namespace}
          prefix={this.prefix}
        />
        <Services
          selector={selector}
          cluster={cluster}
          namespace={namespace}
          prefix={this.prefix}
        />
        <Workloads
          selector={selector}
          cluster={cluster}
          namespace={namespace}
          prefix={this.prefix}
        />
        <Volumes
          selector={selector}
          cluster={cluster}
          namespace={namespace}
          prefix={this.prefix}
        />
      </div>
    )
  }
}
