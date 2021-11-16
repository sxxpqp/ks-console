import React, { PureComponent } from 'react'
import classnames from 'classnames'
import { Icon } from '@kube-design/components'

import styles from './index.scss'

export default class Item extends PureComponent {
  handleSelect = () => {
    const { onSelect, data } = this.props
    onSelect(data)
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
            ['uncategorized', ''].includes(data.icon)
              ? 'tag'
              : data.icon || 'tag'
          }
          size={16}
          clickable
        />
        {data['name']}
        <label className={styles.number}>{data.count || 0}</label>
        {data.id !== -1 && (
          <label className={styles.actions}>
            <Icon onClick={this.handleEdit} name={'pen'} size={16} clickable />
            <Icon
              onClick={this.handleDelete}
              name={'trash'}
              size={16}
              clickable
            />
          </label>
        )}
      </li>
    )
  }
}
