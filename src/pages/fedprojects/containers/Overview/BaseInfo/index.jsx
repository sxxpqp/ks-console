import React from 'react'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { Icon } from '@kube-design/components'
import { Text } from 'components/Base'
import { getDisplayName } from 'utils'

import styles from './index.scss'

export default class BaseInfo extends React.Component {
  render() {
    const { className, detail = {}, workspace } = this.props

    return (
      <div className={classNames(styles.wrapper, className)}>
        <div className={styles.header}>
          <Icon name="project" size={40} />
          <Text
            title={getDisplayName(detail)}
            description={detail.description || '-'}
          />
        </div>
        <div className={styles.content}>
          <Text
            title={<Link to={`/workspaces/${workspace}`}>{workspace}</Link>}
            description={t('Workspace')}
          />
          <Text title={detail.creator || '-'} description={t('Creator')} />
        </div>
        <img className={styles.background} src="/assets/project-overview.svg" />
      </div>
    )
  }
}
