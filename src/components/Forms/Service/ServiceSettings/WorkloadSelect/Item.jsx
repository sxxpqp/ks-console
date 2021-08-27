import React from 'react'
import classNames from 'classnames'
import { Icon } from '@kube-design/components'
import { ICON_TYPES } from 'utils/constants'

import styles from './index.scss'

export default class WorkloadItem extends React.Component {
  handleClick = () => {
    const { onClick, detail } = this.props
    onClick(detail)
  }

  render() {
    const { module, detail, selected } = this.props
    return (
      <div
        className={classNames(styles.item, { [styles.selected]: selected })}
        onClick={this.handleClick}
      >
        <Icon name={ICON_TYPES[module]} size={16} />
        <div className={styles.ring} />
        <span className={styles.name}>{detail.name}</span>
      </div>
    )
  }
}
