import React from 'react'

import styles from './index.scss'

export default function VerticalLayout({ top, bottom }) {
  return (
    <div className={styles.wrapper}>
      <div>{top}</div>
      <div>{bottom}</div>
    </div>
  )
}
