import React from 'react'
import { Button, Input } from '@kube-design/components'

import ObjectInput from '../ObjectInput'
import styles from './index.scss'

export default class PropertyItem extends React.Component {
  handleChange = value => {
    const { index, onChange } = this.props
    onChange(index, value)
  }

  handleDelete = () => {
    const { index, onDelete } = this.props
    onDelete(index)
  }

  render() {
    const {
      readOnly,
      onDelete,
      onChange,
      keyProps = {},
      valueProps = {},
      ...rest
    } = this.props

    const { component: KeyInput = Input, ...keyInputProps } = keyProps
    const { component: ValueInput = Input, ...valueInputProps } = valueProps

    return (
      <div className={styles.item}>
        <ObjectInput {...rest} onChange={this.handleChange}>
          <KeyInput
            name="key"
            placeholder={t('key')}
            readOnly={readOnly}
            {...keyInputProps}
          />
          <ValueInput
            name="value"
            placeholder={t('value')}
            readOnly={readOnly}
            {...valueInputProps}
          />
        </ObjectInput>
        {!readOnly && (
          <Button
            type="flat"
            icon="trash"
            className={styles.delete}
            onClick={this.handleDelete}
          />
        )}
      </div>
    )
  }
}
