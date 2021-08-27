import React from 'react'
import classNames from 'classnames'
import { Icon } from '@kube-design/components'

import styles from './index.scss'

const ServiceItem = ({ className, data, onClick }) => {
  const handleClick = () => onClick(data)
  return (
    <div className={classNames(styles.item, className)} onClick={handleClick}>
      <div className={styles.icon}>
        <Icon name="network-router" size={40} />
      </div>
      <div className={styles.name}>
        <div className="h6">{data.name}</div>
        <p>{t(data.type)}</p>
      </div>
    </div>
  )
}

export default ServiceItem
