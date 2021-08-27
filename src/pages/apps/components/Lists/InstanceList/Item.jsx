import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { Status } from 'components/Base'
import { getLocalTime } from 'utils'

import styles from './index.scss'

export default class InstanceItem extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    detail: PropTypes.object,
    showVersion: PropTypes.bool,
  }

  static defaultProps = {
    detail: {},
    showVersion: false,
  }

  renderContent() {
    const { detail, showVersion } = this.props
    const { version } = detail

    return (
      <div className={styles.content}>
        <dl>
          <dt>{detail.name}</dt>
          <dd>{t('Instance Name')}</dd>
        </dl>
        <dl>
          <dt>
            <Status
              className={styles.status}
              type={detail.status}
              name={t(detail.status)}
            />
          </dt>
          <dd>{t('Status')}</dd>
        </dl>
        {showVersion && (
          <dl>
            <dt>{version.name}</dt>
            <dd>{t('Version')}</dd>
          </dl>
        )}
        <dl>
          <dt>{detail.zone}</dt>
          <dd>{t('In Project')}</dd>
        </dl>
        <dl>
          <dt>{detail.cluster || detail.runtime_id}</dt>
          <dd>{t('Cluster')}</dd>
        </dl>
        <dl>
          <dt>
            {getLocalTime(detail.upgrade_time || detail.create_time).format(
              'YYYY-MM-DD HH:mm:ss'
            )}
          </dt>
          <dd>{t('Updated Time')}</dd>
        </dl>
      </div>
    )
  }

  render() {
    const { className } = this.props

    return (
      <div className={classnames(styles.item, className)}>
        <div className={styles.itemMain}>{this.renderContent()}</div>
      </div>
    )
  }
}
