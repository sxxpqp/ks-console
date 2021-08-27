import React, { PureComponent } from 'react'
import classnames from 'classnames'
import { Icon } from '@kube-design/components'

import styles from './index.scss'

export default class Item extends PureComponent {
  handleSelect = () => {
    const { onSelect, data } = this.props
    onSelect(data.category_id)
  }

  handleEdit = e => {
    e.stopPropagation()
    const { onEdit, data } = this.props
    onEdit(data)
  }

  handleDelete = e => {
    e.stopPropagation()
    const { onDelete, data } = this.props
    onDelete(data)
  }

  render() {
    const { data, isSelected } = this.props

    return (
      <li
        onClick={this.handleSelect}
        className={classnames({
          [styles.hasAction]: data.category_id !== 'ctg-uncategorized',
          [styles.active]: isSelected,
        })}
      >
        <Icon
          className={styles.icon}
          name={
            ['uncategorized', ''].includes(data.description)
              ? 'tag'
              : data.description
          }
          size={16}
          clickable
        />
        {t(`APP_CATE_${data.name.toUpperCase()}`, {
          defaultValue: data.name,
        })}
        <label className={styles.number}>{data.app_total || 0}</label>
        <label className={styles.actions}>
          <Icon onClick={this.handleEdit} name={'pen'} size={16} clickable />
          <Icon
            onClick={this.handleDelete}
            name={'trash'}
            size={16}
            clickable
          />
        </label>
      </li>
    )
  }
}
