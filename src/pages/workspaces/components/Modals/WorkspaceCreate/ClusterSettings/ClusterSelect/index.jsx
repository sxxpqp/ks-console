import React, { Component } from 'react'
import classNames from 'classnames'
import { isEmpty } from 'lodash'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import { Alert, Checkbox } from '@kube-design/components'
import ClusterTitle from 'components/Clusters/ClusterTitle'

import ClusterStore from 'stores/cluster'

import styles from './index.scss'

@observer
export default class ClusterSettings extends Component {
  clusterStore = new ClusterStore()

  state = {
    showTip: false,
    hostClusters: [],
  }

  componentDidMount() {
    this.fetchData()
  }

  async fetchData() {
    if (globals.app.hasPermission({ module: 'clusters', action: 'manage' })) {
      await this.clusterStore.fetchList({
        limit: -1,
      })
    } else {
      await this.clusterStore.fetchList({
        limit: -1,
        from: 'resource',
        labelSelector: 'cluster.kubesphere.io/visibility=public',
      })
    }

    this.setState({
      hostClusters: this.clusterStore.list.data
        .filter(item => item.isHost)
        .map(item => item.name),
    })
  }

  handleClick = e => {
    const { value = [], onChange } = this.props
    let newValue

    const name = e.currentTarget.dataset.cluster

    if (value.some(item => item.name === name)) {
      newValue = value.filter(item => item.name !== name)
    } else {
      newValue = [...value, { name }]
    }

    this.setState({
      showTip: newValue.some(item =>
        this.state.hostClusters.includes(item.name)
      ),
    })

    onChange(newValue)
  }

  handleCheckboxClick = e => e.stopPropagation()

  render() {
    const { value = [] } = this.props
    const { data, isLoading } = toJS(this.clusterStore.list)

    if (isEmpty(data) && !isLoading) {
      return <Alert type="warning" message={t('NO_PUBLIC_CLUSTER_TIP')} />
    }

    return (
      <div className={styles.wrapper}>
        {this.state.showTip && (
          <Alert
            className="margin-b12"
            type="warning"
            message={t('SELECT_HOST_CLUSTER_WARNING')}
          />
        )}
        {data.map(cluster => (
          <div
            key={cluster.name}
            className={classNames(styles.item, {
              [styles.disabled]: !globals.app.isMultiCluster,
            })}
            data-cluster={cluster.name}
            onClick={globals.app.isMultiCluster ? this.handleClick : null}
          >
            <Checkbox
              checked={value.some(item => item.name === cluster.name)}
              disabled={!globals.app.isMultiCluster}
              onClick={this.handleCheckboxClick}
            />
            <ClusterTitle
              className={styles.cluster}
              tagClass="float-right"
              cluster={cluster}
              noTip
            />
          </div>
        ))}
      </div>
    )
  }
}
