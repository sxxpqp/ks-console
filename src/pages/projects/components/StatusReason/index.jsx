import { get } from 'lodash'
import React from 'react'

import { Tooltip, Icon } from '@kube-design/components'
import styles from './index.scss'

const isSuccess = (type, condition) => {
  const conditionType = condition.type
  const conditionStatus = condition.status

  if (type === 'volume') {
    return conditionStatus === 'True'
  }

  return conditionType === 'ReplicaFailure'
    ? conditionStatus === 'False'
    : conditionStatus === 'True'
}

export default function StatusReason({
  data,
  status,
  reason,
  type = 'workload',
}) {
  const conditions = (
    <div>
      <div className="tooltip-title">{t('WORKLOAD_CONDITIONS')}</div>
      <div>
        {get(data, 'status.conditions', []).map(cd => (
          <div key={cd.type} className={styles.condition}>
            <div className={styles.title}>
              {isSuccess(type, cd) ? (
                <Icon name="success" type="coloured" />
              ) : (
                <Icon
                  name="error"
                  color={{
                    primary: '#ffffff',
                    secondary: '#ea4641',
                  }}
                />
              )}
              <span>
                {t(`${type.toUpperCase()}_CONDITION_${cd.type.toUpperCase()}`, {
                  defaultValue: cd.type,
                })}
              </span>
            </div>
            {cd.status && <p>{`${t('Status')}: ${cd.status}`}</p>}
            {cd.reason && (
              <p>{`${t('Reason')}: ${t(
                `${type.toUpperCase()}_REASON_${cd.reason.toUpperCase()}`,
                {
                  defaultValue: cd.reason,
                }
              )}`}</p>
            )}
            {cd.message && <p>{`${t('Message')}: ${cd.message}`}</p>}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <span className={styles.reason}>
      <Tooltip placement="right" content={conditions}>
        <Icon
          name="information"
          color={{
            primary: '#ffffff',
            secondary: status === 'error' ? '#ab2f29' : '#f5a623',
          }}
        />
      </Tooltip>
      {reason && (
        <span className={status === 'error' ? styles.error : styles.warning}>
          {t(reason)}
        </span>
      )}
    </span>
  )
}
