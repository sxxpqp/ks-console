import React from 'react'

import styles from './index.scss'

export default function EditMonitorFormLayou({ preview, sidebar, main }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.preview}>{preview} </div>
      <div className={styles.form}>
        <div className={styles.sidebar}>{sidebar}</div>
        <div className={styles.resource}>{main}</div>
      </div>
    </div>
  )
}
