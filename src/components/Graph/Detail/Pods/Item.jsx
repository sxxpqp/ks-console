import React from 'react'
import classnames from 'classnames'
import { get } from 'lodash'
import { Icon } from '@kube-design/components'
import { Link } from 'react-router-dom'
import { getLocalTime } from 'utils'

import styles from './index.scss'

export default class Item extends React.Component {
  handleLinkClick = () => {
    localStorage.setItem('pod-detail-referrer', location.pathname)
  }

  render() {
    const { data } = this.props
    const { workspace, cluster, namespace } = this.props.match.params

    const status = data.podStatus

    const statusStr =
      status.type === 'running' || status.type === 'completed'
        ? 'running'
        : 'updating'

    return (
      <div className={styles.podItem}>
        <div className={styles.icon}>
          <Icon name="pod" size={32} />
          <span className={classnames(styles.status, styles[statusStr])} />
        </div>
        <div className={styles.text}>
          <Link
            to={`/${workspace}/clusters/${cluster}/projects/${namespace}/pods/${data.name}`}
          >
            <strong onClick={this.handleLinkClick}>{data.name}</strong>
          </Link>
          <p>
            {t('Updated at')}{' '}
            {getLocalTime(
              get(data, 'status.startTime') || get(data, 'createTime')
            ).format(`YYYY-MM-DD HH:mm:ss`)}
          </p>
        </div>
      </div>
    )
  }
}
