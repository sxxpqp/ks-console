import React, { Component } from 'react'

import styles from './index.scss'

export default class Wrapper extends Component {
  render() {
    const { label, desc, required, children } = this.props
    return (
      <div className={styles.wrapper}>
        {label && (
          <label className={styles.label} htmlFor={name}>
            {label}
            {required ? <span className={styles.requiredIcon}>*</span> : null}
          </label>
        )}
        <div className={styles.control}>
          {children}
          {desc && <div className={styles.desc}>{desc}</div>}
        </div>
      </div>
    )
  }
}
