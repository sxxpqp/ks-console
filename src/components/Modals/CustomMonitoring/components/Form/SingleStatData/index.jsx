import React, { Component } from 'react'

import { Form, Input, Select } from '@kube-design/components'
import { NumberInput } from 'components/Inputs'
import { unitTransformMap } from 'utils/monitoring'

import CustomMonitorMetircQueryInput from '../../MetircQueryInput'
import FormItemContainer from '../ItemContianer'
import Field from '../Field'

import styles from './index.scss'

const formatOpts = Object.keys(unitTransformMap).map(format => ({
  label: format,
  value: format,
}))

export default class SingleStatDataForm extends Component {
  render() {
    return (
      <div className={styles.wrapper}>
        <div className={styles.config}>
          <Form.Item
            rules={[{ required: true, message: t('Please input name') }]}
          >
            <FormItemContainer name={'title'}>
              {({ onChange, value }) => (
                <Field label={t('GRAPH_NAME')} tips={''}>
                  <Input
                    className={styles.input}
                    value={value}
                    onChange={onChange}
                  />
                </Field>
              )}
            </FormItemContainer>
          </Form.Item>

          <Form.Item>
            <FormItemContainer name={'format'} defaultValue={formatOpts[0]}>
              {({ onChange, value }) => (
                <Field label={t('Unit')} tips={''}>
                  <Select
                    options={formatOpts}
                    value={value}
                    onChange={onChange}
                  />
                </Field>
              )}
            </FormItemContainer>
          </Form.Item>
          <Form.Item>
            <FormItemContainer name={'decimals'} defaultValue={0}>
              {({ onChange, value }) => (
                <Field label={t('DECIMALS')} tips={''}>
                  <NumberInput
                    value={value}
                    max={5}
                    min={0}
                    onChange={onChange}
                  />
                </Field>
              )}
            </FormItemContainer>
          </Form.Item>
        </div>
        <div className={styles.metric}>
          <Form.Item>
            <CustomMonitorMetircQueryInput
              name={'targets[0].expr'}
              {...this.props}
            />
          </Form.Item>
        </div>
      </div>
    )
  }
}
