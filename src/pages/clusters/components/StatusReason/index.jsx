import { get } from 'lodash'
import React from 'react'

import { Tooltip, Icon } from '@kube-design/components'
import styles from './index.scss'

const isSuccess = condition => condition.status === 'True'

export default function StatusReason({ data, noTip }) {
  const conditions = (
    <div>
      <div className="tooltip-title">{t('CLUSTER_CONDITIONS')}</div>
      <div>
        {Object.values(get(data, 'conditions', {})).map(cd => (
          <div key={cd.type} className={styles.condition}>
            <div className={styles.title}>
              {isSuccess(cd) ? (
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
                {t(`CLUSTER_CONDITION_${cd.type.toUpperCase()}`, {
                  defaultValue: cd.type,
                })}
              </span>
            </div>
            {cd.status && <p>{`${t('Status')}: ${cd.status}`}</p>}
            {cd.reason && (
              <p>{`${t('Reason')}: ${t(
                `CLUSTER_REASON_${cd.reason.toUpperCase()}`,
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

  const icon = (
    <Icon
      name="information"
      color={{
        primary: '#ffffff',
        secondary: status === 'error' ? '#ab2f29' : '#f5a623',
      }}
    />
  )

  return (
    <span className={styles.reason}>
      {noTip ? (
        icon
      ) : (
        <Tooltip placement="right" content={conditions}>
          {icon}
        </Tooltip>
      )}
      <span className={status === 'error' ? styles.error : styles.warning}>
        {t('Not Ready')}
      </span>
    </span>
  )
}
