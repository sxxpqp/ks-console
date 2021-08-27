import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { isEmpty } from 'lodash'
import { Panel } from 'components/Base'

import ServiceMonitorStore from 'stores/monitoring/service.monitor'

import { joinSelector } from 'utils'

import Item from './Item'

import styles from './index.scss'

@observer
export default class ServiceMonitors extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    selector: PropTypes.object,
  }

  constructor(props) {
    super(props)

    if (props.store) {
      this.store = props.store
    } else {
      this.store = new ServiceMonitorStore()
    }
  }

  componentDidMount() {
    this.getData()
  }

  getData = () => {
    const { cluster, namespace, labels } = this.props

    if (!isEmpty(labels)) {
      this.store.fetchListByK8s({
        cluster,
        namespace,
        labelSelector: joinSelector(labels),
      })
    }
  }

  renderContent() {
    const { data } = this.store.list

    if (isEmpty(data)) return null

    const endpoints = data.reduce((prev, cur) => {
      return [
        ...prev,
        ...cur.endpoints.map(ep => ({
          ...ep,
          name: cur.name,
        })),
      ]
    }, [])

    return (
      <div className={styles.content}>
        {endpoints.map(item => (
          <Item key={item.name} detail={item} />
        ))}
      </div>
    )
  }

  render() {
    const { className } = this.props

    const content = this.renderContent()

    if (!content) {
      return null
    }

    return (
      <Panel
        className={className}
        title={`${t('Service Monitoring Exporter')} (${t(
          'Exporter Service Ports'
        )})`}
      >
        {content}
      </Panel>
    )
  }
}
