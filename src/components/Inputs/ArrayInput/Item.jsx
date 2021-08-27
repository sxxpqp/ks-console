import React from 'react'

import { Button } from '@kube-design/components'

import styles from './index.scss'

const Item = ({ component, index, value, arrayValue, onChange, onDelete }) => {
  const childNode = React.cloneElement(component, {
    ...component.props,
    index,
    value,
    arrayValue,
    onChange,
  })

  return (
    <div className={styles.item}>
      {childNode}
      <Button
        type="flat"
        icon="trash"
        className={styles.delete}
        onClick={onDelete}
      />
    </div>
  )
}

export default Item
