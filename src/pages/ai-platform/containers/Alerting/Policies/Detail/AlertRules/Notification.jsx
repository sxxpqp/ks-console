import React, { Component } from 'react'

import styles from './index.scss'

export default class Nofiticaction extends Component {
  render() {
    const { summary, message } = this.props
    return (
      <div className={styles.notify}>
        <div className={styles.title}>
          {t('Summary')}: {summary}
        </div>
        <div className={styles.content}>
          {t('Message')}: {message}
        </div>
      </div>
    )
  }
}
