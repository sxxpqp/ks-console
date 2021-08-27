import React, { Component } from 'react'

import { Icon } from '@kube-design/components'

import styles from './index.scss'

export default class ContainerImages extends Component {
  render() {
    const { container, selected, key } = this.props

    return (
      <div key={key}>
        <span>{`${t('Image')}: ${container.image}`}</span>
        {selected && (
          <span className={styles.modify}>
            <span>{t('Edit')}</span>
            <Icon type="light" size={20} name="chevron-down" />
          </span>
        )}
      </div>
    )
  }
}
