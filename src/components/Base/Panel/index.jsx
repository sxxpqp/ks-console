import React from 'react'
import classNames from 'classnames'

import { Loading } from '@kube-design/components'

import styles from './index.scss'

export default class Panel extends React.Component {
  render() {
    const { className, title, loading = false, children, extras } = this.props
    const empty = (
      <div className={styles.empty}>
        {t('NOT_AVAILABLE', { resource: title })}
      </div>
    )

    return (
      <div
        className={styles.wrapper}
        data-test={`panel-${
          title
            ? title
                .toLowerCase()
                .split(' ')
                .join('-')
            : 'default'
        }`}
      >
        {title && <div className={styles.title}>{title}</div>}
        <div className={classNames(styles.panel, className)}>
          {loading ? <Loading className={styles.loading} /> : children || empty}
        </div>
        {extras}
      </div>
    )
  }
}
