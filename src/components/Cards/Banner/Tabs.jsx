import React from 'react'

import RadioGroup from './RadioGroup'

import styles from './index.scss'

export default function Tabs({ tabs }) {
  return (
    <div className={styles.tabsWrapper}>
      <RadioGroup {...tabs} />
    </div>
  )
}
