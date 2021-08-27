import React from 'react'
import classNames from 'classnames'

import styles from './index.scss'

export default function FromGroupCard({ className, children, label }) {
  return (
    <div className={classNames(styles.wrapper, className)}>
      <header>{label}</header>
      <div>{children}</div>
    </div>
  )
}
