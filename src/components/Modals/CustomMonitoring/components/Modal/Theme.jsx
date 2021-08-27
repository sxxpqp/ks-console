import React from 'react'
import classnames from 'classnames'

import Modal from './index'

import styles from './theme.scss'

export default function ThemeModal({ theme, className, ...props }) {
  const themeStyle = theme === 'light' ? styles.light : styles.dark
  return <Modal className={classnames(className, themeStyle)} {...props} />
}
