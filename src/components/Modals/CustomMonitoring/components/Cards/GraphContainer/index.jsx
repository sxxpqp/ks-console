import React from 'react'

import { Icon, Tooltip } from '@kube-design/components'

import styles from './index.scss'

export default function({ title, description, children }) {
  return (
    <div className={styles.wrapper}>
      <header>
        <h3>
          {title}
          {description && (
            <Tooltip content={description}>
              <Icon name={'question'} />
            </Tooltip>
          )}
        </h3>
      </header>
      {children}
    </div>
  )
}
