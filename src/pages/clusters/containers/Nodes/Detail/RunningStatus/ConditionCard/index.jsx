import React from 'react'

import { Icon, Tooltip } from '@kube-design/components'
import { getLocalTime } from 'utils'
import { getConditionsStatus, NODE_CONDITION_ICONS } from 'utils/node'
import { Text } from 'components/Base'

import styles from './index.scss'

const ConditionCard = ({ data }) => {
  if (!NODE_CONDITION_ICONS[data.type]) {
    return null
  }

  const statusType = getConditionsStatus(data)

  const content = (
    <div>
      <div className="tooltip-title">{data.reason}</div>
      <p className="tooltip-desc">{data.message}</p>
      <p className="tooltip-desc">
        {t('lastHeartbeatTime')}:{' '}
        {getLocalTime(data.lastHeartbeatTime).format('YYYY-MM-DD HH:mm:ss')}
      </p>
    </div>
  )

  return (
    <div className={styles.card}>
      <div className={styles.icon}>
        <Icon name={NODE_CONDITION_ICONS[data.type]} size={40} />
        <Tooltip content={content}>
          {statusType === 'Running' ? (
            <Icon
              className={styles.check}
              name="check"
              type="light"
              size={12}
            />
          ) : (
            <Icon
              className={styles.substract}
              name="substract"
              type="light"
              size={12}
            />
          )}
        </Tooltip>
      </div>
      <Text
        title={t(`NODE_${data.type.toUpperCase()}`)}
        description={t(`NODE_${data.type.toUpperCase()}_DESC`)}
      />
    </div>
  )
}

export default ConditionCard
