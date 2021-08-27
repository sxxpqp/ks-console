import React from 'react'
import { Icon } from '@kube-design/components'

import styles from './index.scss'

export default function RowsSortItem({
  title,
  sortHandlerClassName,
  onEditClick,
  onDeleteClick,
}) {
  return (
    <div className={styles.wrapper}>
      <h3>{title}</h3>
      <div className={styles.tools}>
        <Icon name={'pen'} className={styles.edit} onClick={onEditClick} />
        <Icon name={'trash'} className={styles.edit} onClick={onDeleteClick} />
        <Icon name={'drag-handle'} className={sortHandlerClassName} />
      </div>
    </div>
  )
}
