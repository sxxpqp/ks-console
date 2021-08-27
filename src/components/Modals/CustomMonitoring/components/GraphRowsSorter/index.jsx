import React from 'react'

import { Icon } from '@kube-design/components'

import styles from './index.scss'

const ICON_SIZE = 24

export default function GraphRowsSortor({ rows }) {
  return rows.map(row => (
    <div key={row.id}>
      {row.hideTitle || (
        <h3 className={styles.rowTitle}>
          <span>{row.title}</span>
          <div class={styles.operations}>
            <Icon size={ICON_SIZE} name={'pen'} />
            <Icon size={ICON_SIZE} name={'sort-ascending'} />
            <Icon size={ICON_SIZE} name={'sort-descending'} />
          </div>
        </h3>
      )}
      {row.panels.map(panel => (
        <div className={styles.item} key={panel.title}>
          {panel.title}
          <div className={styles.operations}>
            <Icon
              size={ICON_SIZE}
              className={styles.dragger}
              name={'drag-handle'}
            />
          </div>
        </div>
      ))}
    </div>
  ))
}
