import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { isEmpty, get } from 'lodash'

import { ICON_TYPES } from 'utils/constants'

import { Icon } from '@kube-design/components'
import { Panel } from 'components/Base'

import styles from './index.scss'

export default class ServiceCard extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    service: PropTypes.object,
    loading: PropTypes.bool,
  }

  static defaultProps = {
    service: {},
    loading: true,
  }

  get ports() {
    return get(this.props.service, 'ports', []).map(item => {
      const targetPort = item.targetPort ? `:${item.targetPort}` : ''
      return `${item.port}${targetPort}/${item.protocol}`
    })
  }

  renderContent() {
    const { service, prefix } = this.props

    if (isEmpty(service)) return null

    const { name, type } = service

    return (
      <div className={styles.item}>
        <Icon className={styles.icon} name={ICON_TYPES['services']} size={40} />
        <div className={styles.info}>
          <div className={styles.base}>
            <strong>
              <Link to={`${prefix}/services/${name}`}>{name}</Link>
            </strong>
            <p>{type}</p>
          </div>
          <div className={styles.ports}>
            <div className={styles.record}>
              <label>{t('Ports')}:</label>
              <div className={styles.text}>
                {this.ports.map((item, i) => (
                  <p key={i}>{item}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { className } = this.props
    const title = this.props.title || t('Service')

    return (
      <Panel className={classnames(styles.main, className)} title={title}>
        {this.renderContent()}
      </Panel>
    )
  }
}
