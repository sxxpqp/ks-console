import React from 'react'

import { Status } from 'components/Base'
import { getWorkloadStatus } from 'utils/status'

export default function JobStatus({ data, module }) {
  const { status } = getWorkloadStatus(data, module)

  const type = status === 'Running' ? 'JobRunning' : status
  return <Status type={type} name={t(status)} flicker />
}
