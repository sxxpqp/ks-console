import React from 'react'

import styles from './index.scss'

export default function SingleStateGraph({ singleState, title }) {
  return (
    <div className={styles.wrapper}>
      <h3>
        <span>{singleState}</span>
      </h3>
      <p>{title}</p>
    </div>
  )
}
