import React from 'react'
import classNames from 'classnames'

import styles from './index.scss'

export default function SubTitle({ className, title, description }) {
  return (
    <div className={classNames(styles.text, className)}>
      <div>{title}</div>
      <p>{description}</p>
    </div>
  )
}
