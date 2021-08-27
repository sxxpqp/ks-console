import React from 'react'
import classnames from 'classnames'

import { Button } from '@kube-design/components'

import styles from './index.scss'

export default function SquareButton(props = {}) {
  return (
    <Button
      className={classnames(styles.wrapper, {
        [styles.danger]: props.type === 'danger',
      })}
      {...props}
    />
  )
}
