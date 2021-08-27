import React from 'react'

import styles from './index.scss'

export default function GraphOverviewLayout({ graphList, graphRowList }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.graphs}>{graphList}</div>
      <div className={styles.row}>{graphRowList}</div>
    </div>
  )
}
