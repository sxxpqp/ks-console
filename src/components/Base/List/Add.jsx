import React from 'react'
import classNames from 'classnames'
import { Icon } from '@kube-design/components'

import styles from './index.scss'

export default class Add extends React.Component {
  render() {
    const { icon, image, title, description, onClick, type } = this.props

    return (
      <div
        className={classNames(
          styles.add,
          { [styles.withIcon]: icon || image },
          styles[type]
        )}
        onClick={onClick}
      >
        <div className={styles.icon}>
          {image ? (
            <img src={image} alt="" />
          ) : (
            icon && <Icon name={icon} size={40} />
          )}
        </div>
        <div className={styles.text}>
          <div className={styles.title}>{title}</div>
          <div className={styles.description}>{description}</div>
        </div>
      </div>
    )
  }
}
