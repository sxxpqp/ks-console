import React from 'react'
import styles from './index.scss'

export default function ColumeInput({ left, right }) {
  return (
    <div className={styles.wrapper}>
      <div>{left}</div>
      {right}
    </div>
  )
}
