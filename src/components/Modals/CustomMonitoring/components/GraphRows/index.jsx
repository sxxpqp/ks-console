import React from 'react'
import GraphMenu from '../GraphMenu'

import styles from './index.scss'

export default function GraphRows({ rows }) {
  return rows.map(row => (
    <div key={row.id}>
      {row.hideTitle || <h3 className={styles.rowTitle}>{row.title}</h3>}
      {row.panels.map(panel => (
        <GraphMenu key={panel.id} title={panel.title} metrics={panel.metrics} />
      ))}
    </div>
  ))
}
