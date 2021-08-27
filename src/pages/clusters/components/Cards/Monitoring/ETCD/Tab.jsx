import React from 'react'
import classnames from 'classnames'

import { Icon } from '@kube-design/components'

import styles from './index.scss'

const TabItem = ({ active, icon, name, title }) => {
  const iconProps = { color: { primary: '#fff', secondary: '#fff' } }

  return (
    <div
      className={classnames(styles.tab, {
        [styles.active]: active,
      })}
    >
      <Icon name={icon} size={40} {...(active ? iconProps : null)} />
      <div className={styles.info}>
        <div className={styles.title}>{t(name)}</div>
        <p dangerouslySetInnerHTML={{ __html: t(title) }} />
      </div>
    </div>
  )
}

export default TabItem
