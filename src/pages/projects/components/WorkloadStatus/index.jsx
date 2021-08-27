import { get, isEmpty } from 'lodash'
import React from 'react'

import { Tooltip, Icon } from '@kube-design/components'

import { Status } from 'components/Base'
import { S2I_STATUS_DESC } from 'utils/constants'
import { getWorkloadStatus } from 'utils/status'
import styles from './index.scss'

export default function WorkloadStatus({ data, module }) {
  const { status: statusResult } = getWorkloadStatus(data, module) || ''
  if (statusResult.startsWith('S2I')) {
    const S2iStatus = statusResult.slice(4)
    return (
      <div className={styles.status}>
        <Status type={S2iStatus} name={t(S2I_STATUS_DESC[S2iStatus])} flicker />
      </div>
    )
  }

  if (module === 'daemonsets') {
    return (
      <div className={styles.status}>
        <Status
          type={statusResult}
          name={t(statusResult)}
          total={get(data, 'status.desiredNumberScheduled', 0)}
          ready={get(data, 'status.numberAvailable', 0)}
          flicker
        />
      </div>
    )
  }

  return (
    <div className={styles.status}>
      <Status
        type={statusResult}
        name={t(statusResult)}
        total={data.podNums}
        ready={data.readyPodNums}
        flicker
      />
      {!isEmpty(get(data, 'annotations["kubesphere.io/relatedHPA"]')) && (
        <Tooltip
          content={t('Horizontal Pod Autoscaling has been set')}
          trigger="hover"
        >
          <Icon name="timed-task" />
        </Tooltip>
      )}
    </div>
  )
}
