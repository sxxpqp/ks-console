import React from 'react'
import { Tooltip, Icon } from '@kube-design/components'
import classnames from 'classnames'

import styles from './index.scss'

export default function Field({ label, children, tips, className }) {
  return (
    <div className={classnames(styles.wrapper, className)}>
      <label className={styles.label}>
        <span>{label}</span>
        {tips && (
          <Tooltip content={tips}>
            <Icon name={'information'} />
          </Tooltip>
        )}
      </label>
      <div className={styles.content}>{children}</div>
    </div>
  )
}
