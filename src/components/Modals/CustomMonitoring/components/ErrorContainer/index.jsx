import React from 'react'
import { Tooltip } from '@kube-design/components'
import styles from './index.scss'

export default function ErrorContainer({ errorMessage, children }) {
  return (
    <div className={styles.wrapper}>
      {errorMessage && (
        <Tooltip content={errorMessage}>
          <div className={styles.error} />
        </Tooltip>
      )}
      {children}
    </div>
  )
}
