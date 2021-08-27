import React from 'react'
import classNames from 'classnames'
import { Icon, Button } from '@kube-design/components'

import { Indicator } from 'components/Base'

import styles from './index.scss'

export default class Item extends React.Component {
  renderDetail(details) {
    return details.map((detail, index) => (
      <div key={index} className={classNames(styles.text, detail.className)}>
        <div className={styles.title}>{detail.title}</div>
        {detail.description && (
          <div className={styles.description}>{detail.description}</div>
        )}
      </div>
    ))
  }

  render() {
    const {
      icon,
      image,
      title,
      status,
      description,
      extras,
      details,
      operations,
      onDelete,
      onEdit,
      onClick,
      className,
      titleClass,
      ...rest
    } = this.props

    return (
      <div
        className={classNames(
          styles.item,
          {
            [styles.withIcon]: icon || image,
          },
          className
        )}
        onClick={onClick}
        {...rest}
      >
        <div className={styles.icon}>
          {image ? (
            <img src={image} alt="" />
          ) : (
            icon && <Icon name={icon} size={40} />
          )}
          {status ? (
            <Indicator className={styles.indicator} type={status} />
          ) : null}
        </div>
        <div className={styles.texts}>
          <div className={classNames(styles.text, titleClass)}>
            <div className={styles.title}>{title}</div>
            <div className={styles.description}>{description}</div>
          </div>
          {details && this.renderDetail(details)}
        </div>
        {extras}
        {operations || (
          <div className="buttons">
            {onDelete && <Button type="flat" icon="trash" onClick={onDelete} />}
            {onEdit && <Button type="flat" icon="pen" onClick={onEdit} />}
          </div>
        )}
      </div>
    )
  }
}
