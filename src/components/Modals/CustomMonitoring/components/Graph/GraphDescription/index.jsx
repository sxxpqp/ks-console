import React from 'react'
import styles from './index.scss'

export default function GraphDescription({ title, description, children }) {
  return (
    <div className={styles.wrapper}>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      {children}
    </div>
  )
}
