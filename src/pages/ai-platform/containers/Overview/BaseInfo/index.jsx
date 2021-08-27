import React from 'react'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { Icon } from '@kube-design/components'
import { getDisplayName } from 'utils'

import styles from './index.scss'

export default class BaseInfo extends React.Component {
  render() {
    const { className, detail = {} } = this.props

    return (
      <div className={classNames(styles.wrapper, className)}>
        <div className={styles.header}>
          <Icon name="project" size={40} />
          <div className={styles.text}>
            <div>{getDisplayName(detail)}</div>
            <p>{detail.description || '-'}</p>
          </div>
        </div>
        <div className={styles.content}>
          {globals.app.isMultiCluster && (
            <div className={styles.text}>
              <div>{detail.cluster || '-'}</div>
              <p>{t('Cluster')}</p>
            </div>
          )}
          <div className={styles.text}>
            <div>
              {detail.workspace ? (
                <Link to={`/workspaces/${detail.workspace}/overview`}>
                  {detail.workspace}
                </Link>
              ) : (
                '-'
              )}
            </div>
            <p>{t('Workspace')}</p>
          </div>
          <div className={styles.text}>
            <div>{detail.creator || '-'}</div>
            <p>{t('Creator')}</p>
          </div>
        </div>
        <img className={styles.background} src="/assets/project-overview.svg" />
      </div>
    )
  }
}
