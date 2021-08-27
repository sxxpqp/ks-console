import React from 'react'
import classNames from 'classnames'

import styles from './index.scss'

export default class Health extends React.Component {
  render() {
    const { score, className } = this.props

    if (score === undefined) {
      return (
        <span>
          <span
            className={classNames(styles.icon, styles['nostatus'], className)}
          />
          {t('no status')}
        </span>
      )
    }

    if (score <= 30) {
      return (
        <span>
          <span className={classNames(styles.icon, styles.error, className)} />
          {t('Warning')}
        </span>
      )
    }
    if (score > 30 && score <= 80) {
      return (
        <span>
          <span
            className={classNames(styles.icon, styles.subhealth, className)}
          />
          {t('Sub-healthy')}
        </span>
      )
    }
    return (
      <span>
        <span className={classNames(styles.icon, styles.health, className)} />
        {t('Healthy')}
      </span>
    )
  }
}
