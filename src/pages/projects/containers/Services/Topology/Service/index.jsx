import React, { Component } from 'react'
import classNames from 'classnames'
import { Icon } from '@kube-design/components'

import styles from './index.scss'

const SHAPE_ICONS = {
  cloud: 'cloud',
  heptagon: 'appcenter',
}

export default class Service extends Component {
  handleClick = () => {
    const { onClick, data } = this.props
    onClick(data)
  }

  render() {
    const { data, isSelected } = this.props
    const { label, labelMinor, x, y } = data
    const width = 150
    const height = 100

    let internalIP
    if (data && data.metadata) {
      const metadataItem = data.metadata.find(
        item => item.id === 'kubernetes_ip'
      )

      if (metadataItem) {
        internalIP = metadataItem.value
      }
    }

    return (
      <g
        className={styles.wrapper}
        transform={`translate(${x - width / 2}, ${y - height / 2})`}
      >
        <rect width={width} height={height} rx={4} />
        <foreignObject width={width} height={height}>
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            className={classNames(styles.service, {
              [styles.selected]: isSelected,
            })}
            onClick={this.handleClick}
          >
            <div className={styles.header}>
              <div className={styles.icon}>
                <Icon name={SHAPE_ICONS[data.shape]} size={40} />
              </div>
              <div className={styles.text}>
                <div className={styles.title} title={label}>
                  {label}
                </div>
                <div className={styles.description}>{labelMinor}</div>
              </div>
            </div>
            <div className={styles.footer}>{internalIP || label}</div>
          </div>
        </foreignObject>
      </g>
    )
  }
}
