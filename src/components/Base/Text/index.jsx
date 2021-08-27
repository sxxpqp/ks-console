import React from 'react'
import { Icon } from '@kube-design/components'
import { isUndefined } from 'lodash'
import classNames from 'classnames'

import styles from './index.scss'

export default class Text extends React.PureComponent {
  render() {
    const {
      icon,
      title,
      description,
      className,
      ellipsis,
      extra,
      onClick,
    } = this.props

    return (
      <div
        className={classNames(
          styles.wrapper,
          { [styles.clickable]: !!onClick, [styles.ellipsis]: ellipsis },
          className
        )}
        onClick={onClick}
      >
        {icon && <Icon className={styles.icon} name={icon} size={40} />}
        <div className={styles.text}>
          <div>{isUndefined(title) || title === '' ? '-' : title}</div>
          <div>{description}</div>
        </div>
        {extra}
      </div>
    )
  }
}
