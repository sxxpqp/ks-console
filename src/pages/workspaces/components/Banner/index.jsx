import React from 'react'
import { Icon } from '@kube-design/components'

import styles from './index.scss'

export default class Banner extends React.Component {
  render() {
    const { icon, image, title, desc } = this.props
    return (
      <div className={styles.banner}>
        <div className={styles.icon}>
          {image ? (
            <img src={image} alt="" />
          ) : (
            <Icon name={icon} type="light" size={36} />
          )}
        </div>
        <div className={styles.title}>
          <div className="h3">{title}</div>
          <p>{desc}</p>
        </div>
      </div>
    )
  }
}
