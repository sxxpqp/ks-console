import React from 'react'
import { Form, Icon, Input } from '@kube-design/components'
import FormItemContainer from 'components/Modals/CustomMonitoring/components/Form/ItemContianer'
import Field from 'components/Modals/CustomMonitoring/components/Form/Field'
import CustomMonitorMetircQueryInput from 'components/Modals/CustomMonitoring/components/MetircQueryInput'

import styles from './index.scss'

export default function GrafanaTargetInput({
  prefix,
  onUpClick,
  onDownClick,
  onDelete,
  ...rest
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
              <FormItemContainer name={`${prefix}.legendFormat`} debounce={800}>
                {({ onChange, value }) => (
                  <div>
                    <Field label={t('METRIC_NAME')} tips={''}>
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
              <FormItemContainer name={`${prefix}.step`} debounce={500}>
                {({ onChange, value }) => (
                  <div>
                    <Field label={t('Interval')} tips={''}>
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
            <FormItemContainer name={`${prefix}.expr`} debounce={500}>
              {({ onChange, value }) => (
                <CustomMonitorMetircQueryInput
                  value={value}
                  onChange={onChange}
                  {...rest}
                />
              )}
            </FormItemContainer>
          </Form.Item>
        </div>
      </div>
    </div>
  )
}
