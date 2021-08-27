import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import { Icon } from '@kube-design/components'
import { Panel } from 'components/Base'
import { COMPONENT_ICON_MAP } from 'utils/constants'

import ComponentStore from 'stores/component'

import styles from './index.scss'

@observer
export default class ServiceComponents extends Component {
  store = new ComponentStore()

  get configs() {
    const { cluster } = this.props
    return [
      {
        type: 'kubesphere',
        title: 'KubeSphere',
      },
      {
        type: 'kubernetes',
        title: 'Kubernetes',
      },
      {
        type: 'istio',
        title: 'Istio',
        disabled: !globals.app.hasClusterModule(cluster, 'servicemesh'),
      },
      {
        type: 'monitoring',
        title: 'Monitoring',
        disabled: !globals.app.hasClusterModule(cluster, 'monitoring'),
      },
      {
        type: 'logging',
        title: 'Logging',
        disabled: !globals.app.hasClusterModule(cluster, 'logging'),
      },
      {
        type: 'devops',
        title: 'DevOps',
        disabled: !globals.app.hasClusterModule(cluster, 'devops'),
      },
    ]
  }

  componentDidMount() {
    const { cluster } = this.props
    this.store.fetchList({ cluster })
  }

  render() {
    const { cluster } = this.props
    return (
      <Panel title={t('Service Components')}>
        <div className={styles.icons}>
          {this.configs
            .filter(item => !item.disabled)
            .map(item => (
              <span key={item.type} data-tooltip={item.title}>
                <Link to={`/clusters/${cluster}/components?type=${item.type}`}>
                  <Icon
                    name={COMPONENT_ICON_MAP[item.type]}
                    size={44}
                    clickable
                  />
                </Link>
              </span>
            ))}
        </div>
      </Panel>
    )
  }
}
