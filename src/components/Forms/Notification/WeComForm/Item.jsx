import React, { Component } from 'react'

import { Tag, Icon } from '@kube-design/components'

import styles from './index.scss'

export default class Item extends Component {
  render() {
    const { resources, type, title, onDelete } = this.props
    if (resources.length <= 0) {
      return null
    }
    return (
      <div className={styles.wrapper}>
        <p>{title}</p>
        <div className={styles.listWrapper}>
          {resources.map(item => {
            return (
              <Tag className={styles.tag} type="primary" key={item}>
                {item}
                <Icon
                  name="close"
                  size={12}
                  clickable
                  onClick={() => onDelete(type, item)}
                ></Icon>
              </Tag>
            )
          })}
        </div>
      </div>
    )
  }
}
