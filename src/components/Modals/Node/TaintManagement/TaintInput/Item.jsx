import React from 'react'

import { Button, Icon, Input, Select, Tooltip } from '@kube-design/components'
import { ObjectInput } from 'components/Inputs'

import styles from './index.scss'

const Item = ({ onSelect, onDelete, disabled, ...params }) => {
  const effects = [
    { label: t('NOSCHEDULE_OPTION'), value: 'NoSchedule' },
    { label: t('PREFER_NOSCHEDULE_OPTION'), value: 'PreferNoSchedule' },
    { label: t('NOEXECUTE_OPTION'), value: 'NoExecute' },
  ]

  return (
    <div className={styles.item}>
      <ObjectInput className={styles.inputs} {...params}>
        <Input name="key" placeholder={t('key')} />
        <Input name="value" placeholder={t('value')} />
        <Select name="effect" options={effects} defaultValue="NoSchedule" />
      </ObjectInput>
      <div className={styles.tips}>
        <Tooltip
          content={
            <div dangerouslySetInnerHTML={{ __html: t('TAINTS_TIPS') }} />
          }
        >
          <Icon name="question" size={16} />
        </Tooltip>
      </div>
      <div className={styles.actions}>
        {onSelect && (
          <Tooltip content={t('TAINT_SELECT_TIPS')}>
            <Button
              type="flat"
              icon="add"
              className={styles.select}
              disabled={disabled}
              onClick={onSelect}
            />
          </Tooltip>
        )}
        {onDelete && (
          <Tooltip content={t('TAINT_DELETE_TIPS')}>
            <Button
              type="flat"
              icon="trash"
              className={styles.delete}
              onClick={onDelete}
            />
          </Tooltip>
        )}
      </div>
    </div>
  )
}

export default Item
