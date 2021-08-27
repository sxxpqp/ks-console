import React from 'react'
import classNames from 'classnames'

import { Icon } from '@kube-design/components'

import styles from './index.scss'

export default class Confirm extends React.PureComponent {
  render() {
    const { className, onOk, okText, onCancel, cancelText } = this.props
    return (
      <div className={classNames(styles.wrapper, className)}>
        <div
          className={styles.button}
          onClick={onCancel}
          data-test="confirm-cancel"
        >
          {cancelText || <Icon name="close" type="light" />}
        </div>
        <div className={styles.button} onClick={onOk} data-test="confirm-ok">
          {okText || <Icon name="check" type="light" />}
        </div>
      </div>
    )
  }
}
