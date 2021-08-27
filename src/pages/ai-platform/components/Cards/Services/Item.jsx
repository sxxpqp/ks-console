import { get } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import classnames from 'classnames'

import { Tooltip, Icon } from '@kube-design/components'
import { Text } from 'components/Base'
import ServiceAccess from 'projects/components/ServiceAccess'
import { getDisplayName } from 'utils'

import styles from './index.scss'

export default class ServiceItem extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    prefix: PropTypes.string,
    detail: PropTypes.object,
  }

  static defaultProps = {
    prefix: '',
    detail: {},
  }

  render() {
    const { className, detail, prefix } = this.props

    if (!detail) {
      return null
    }

    const serviceMonitor = get(detail, 'monitor.name')
    const detailName = getDisplayName(detail)

    return (
      <div className={classnames(styles.item, className)}>
        <Text
          icon="network-router"
          title={
            <>
              <Link to={`${prefix}/services/${detail.name}`}>{detailName}</Link>
              {serviceMonitor && (
                <Tooltip
                  content={`${t('Monitoring Exporter')}: ${serviceMonitor}`}
                >
                  <Icon className="margin-l8" name="monitor" size={20} />
                </Tooltip>
              )}
            </>
          }
          description={t(detail.type)}
        />
        <Text
          title={
            get(detail, 'annotations["servicemesh.kubesphere.io/enabled"]') ===
            'true'
              ? t('On')
              : t('Off')
          }
          description={t('Application Governance')}
        />
        <ServiceAccess data={detail} />
      </div>
    )
  }
}
