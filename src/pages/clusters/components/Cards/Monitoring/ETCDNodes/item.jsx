import React from 'react'
import { Link } from 'react-router-dom'

import { ICON_TYPES } from 'utils/constants'

import { Icon } from '@kube-design/components'
import { Status } from 'components/Base'

import styles from './index.scss'

const Item = ({ prefix = '', data = {} }) => {
  const { node_name, node_ip, isOnline, hasLeader, leaderChanges } = data
  const isExternal = !node_name
  const type = isOnline ? 'running' : 'error'

  return (
    <div key={node_ip} className={styles.item}>
      <div className={styles.icon}>
        <Icon name={ICON_TYPES['etcd']} size={40} />
        <Status className={styles.status} type={type} />
      </div>
      <div className={styles.info}>
        <p>
          <strong>
            {isExternal ? (
              t('External ETCD')
            ) : (
              <Link to={`${prefix}/${node_name}`}>{node_name}</Link>
            )}
          </strong>
          <span>
            {t('Node IP')}: {node_ip || '-'}
          </span>
        </p>
        <p>
          <strong>{hasLeader ? t('Yes') : t('No')}</strong>
          <span>{t('ETCD_LEADER_TITLE')}</span>
        </p>
        <p>
          <strong>{leaderChanges}</strong>
          <span>{t('ETCD_CHANGES_TITLE')}</span>
        </p>
      </div>
    </div>
  )
}

export default Item
