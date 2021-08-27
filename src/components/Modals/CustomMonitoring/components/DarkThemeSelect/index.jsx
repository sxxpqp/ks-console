import React from 'react'

import { Select } from '@kube-design/components'

import styles from './index.scss'

export default function DarkThemeSelect(props) {
  return <Select className={styles.wrapper} {...props} />
}
