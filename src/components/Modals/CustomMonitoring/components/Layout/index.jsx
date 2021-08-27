import React from 'react'

import styles from './index.scss'

export default function CustomMonitoringLayout({ sidebar, content }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebar}>{sidebar}</div>
      <div className={styles.content}>{content}</div>
    </div>
  )
}
