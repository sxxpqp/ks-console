import React from 'react'
import { Icon } from '@kube-design/components'
import styles from './index.scss'

export default function AddPanel({ title, onClick }) {
  return (
    <div className={styles.wrapper} onClick={onClick}>
      <Icon name={'add'} />
      <span>{title}</span>
    </div>
  )
}
