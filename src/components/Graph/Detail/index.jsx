import { get } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Icon, Collapse } from '@kube-design/components'

import Monitors from './Monitors'
import PolicyForm from './PolicyForm'
import Pods from './Pods'

import styles from './index.scss'

const { CollapseItem } = Collapse

export default class AppDetail extends React.Component {
  static propTypes = {
    type: PropTypes.string,
    data: PropTypes.object,
  }

  state = {
    name: get(this.props, 'data.name'),
    activeKey: ['monitor'],
  }

  static getDerivedStateFromProps(props, state) {
    const name = get(props, 'data.name')
    if (state.name !== name) {
      return { activeKey: ['monitor'], name }
    }
    return null
  }

  handleCollapseChange = value => {
    this.setState({ activeKey: value })
  }

  render() {
    const { data, fullScreen } = this.props

    if (!data.nodes) {
      return null
    }

    const service = data.nodes.find(item => item.data.nodeType === 'service')

    if (!service) {
      return null
    }

    const protocol = get(service, 'data.traffic[0].protocol')

    return (
      <div className={classNames(styles.detail, 'ks-service-detail')}>
        <div
          className={classNames(styles.wrapper, {
            [styles.fullscreen]: fullScreen,
          })}
        >
          <div className={styles.title}>
            <Icon name="network-router" size={32} />
            <div>
              <div className="h5">{data.name}</div>
              <p>{t('Service')}</p>
            </div>
          </div>
          <Collapse
            activeKey={this.state.activeKey}
            onChange={this.handleCollapseChange}
            accordion
          >
            <CollapseItem label={t('Traffic Monitoring')} key="monitor">
              <Monitors
                detail={data}
                store={this.props.store}
                protocol={protocol}
              />
            </CollapseItem>
            <CollapseItem label={t('Traffic Management')} key="form">
              <PolicyForm
                detail={data}
                store={this.props.store}
                protocol={protocol}
              />
            </CollapseItem>
            <CollapseItem label={t('Pods')} key="pods">
              <Pods detail={data} store={this.props.store} />
            </CollapseItem>
          </Collapse>
        </div>
      </div>
    )
  }
}
