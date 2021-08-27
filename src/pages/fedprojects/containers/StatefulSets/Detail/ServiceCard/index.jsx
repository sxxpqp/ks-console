import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { isEmpty, get } from 'lodash'

import { ICON_TYPES } from 'utils/constants'

import { Panel, Text } from 'components/Base'

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
    const { service, workspace } = this.props

    if (isEmpty(service)) return null

    const { name, namespace } = service

    return (
      <div className={styles.item}>
        <Text
          icon={ICON_TYPES['services']}
          title={
            <Link
              to={`/${workspace}/federatedprojects/${namespace}/services/${name}`}
            >
              {name}
            </Link>
          }
          description={service.type}
        />
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
