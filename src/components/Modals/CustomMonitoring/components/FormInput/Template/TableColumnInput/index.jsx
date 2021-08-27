import React from 'react'
import { Form, Icon, Input } from '@kube-design/components'
import FormItemContainer from 'components/Modals/CustomMonitoring/components/Form/ItemContianer'
import Field from 'components/Modals/CustomMonitoring/components/Form/Field'
import TableColumnStyle from '../../TableColumnStyle'

import styles from './index.scss'

export default function TableColumnInput({
  prefix,
  onUpClick,
  onDownClick,
  onDelete,
}) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.sort}>
        <Icon name={'sort-ascending'} onClick={onUpClick} />
        <Icon name={'sort-descending'} onClick={onDownClick} />
      </div>
      <div className={styles.form}>
        <div className={styles.firstLine}>
          <div>
            <Form.Item className={styles.name}>
              <FormItemContainer name={`${prefix}.alias`}>
                {({ onChange, value }) => (
                  <div>
                    <Field label={t('COLUMN_NAME')} tips={''}>
                      <Input
                        className={styles.input}
                        value={value}
                        onChange={onChange}
                      />
                    </Field>
                  </div>
                )}
              </FormItemContainer>
            </Form.Item>
            <Form.Item className={styles.interval}>
              <FormItemContainer name={`${prefix}.pattern`}>
                {({ onChange, value }) => (
                  <div>
                    <Field label={t('FIELD_NAME')} tips={''}>
                      <Input
                        className={styles.input}
                        value={value}
                        onChange={onChange}
                      />
                    </Field>
                  </div>
                )}
              </FormItemContainer>
            </Form.Item>
          </div>
          <Icon name={'trash'} onClick={onDelete} />
        </div>

        <div className={styles.exprInput}>
          <Form.Item>
            <FormItemContainer name={`${prefix}`}>
              {({ onChange, value }) => (
                <Field label={t('DISPLAY_FORMAT')} tips={''}>
                  <TableColumnStyle
                    value={value}
                    onChange={newValue => onChange({ ...value, ...newValue })}
                  />
                </Field>
              )}
            </FormItemContainer>
          </Form.Item>
        </div>
      </div>
    </div>
  )
}
