import React from 'react'
import { get } from 'lodash'
import { observer } from 'mobx-react'

import {
  Column,
  Columns,
  Form,
  Input,
  Select,
  TextArea,
} from '@kube-design/components'

import { PATTERN_NAME } from 'utils/constants'

import { SEVERITY_LEVEL } from 'configs/alerting/metrics/rule.config'

import { UnitWrapper } from 'components/Inputs'

@observer
export default class BaseInfo extends React.Component {
  get namespace() {
    return get(this.props.formTemplate, 'namespace')
  }

  get durationOptions() {
    return [
      {
        label: 1,
        value: 1,
      },
      {
        label: 5,
        value: 5,
      },
      {
        label: 15,
        value: 15,
      },
      {
        label: 30,
        value: 30,
      },
      {
        label: 60,
        value: 60,
      },
    ]
  }

  get severities() {
    return SEVERITY_LEVEL.map(item => ({
      label: t(item.label),
      value: item.value,
      level: item,
    }))
  }

  nameValidator = (rule, value, callback) => {
    if (!value) {
      return callback()
    }

    this.props.store
      .checkName({
        name: value,
        namespace: this.namespace,
        cluster: this.props.cluster,
      })
      .then(resp => {
        if (resp.exist) {
          return callback({ message: t('Name exists'), field: rule.field })
        }
        callback()
      })
  }

  timeValidator = (rule, value, callback) => {
    const time = /^[0-9]*$/
    if (!time.test(value.slice(0, -1))) {
      return callback({ message: t('Invalid time') })
    }
    callback()
  }

  render() {
    const { isEdit, formRef, formTemplate } = this.props
    const rules = isEdit
      ? []
      : [
          { required: true, message: t('Please input name') },
          {
            pattern: PATTERN_NAME,
            message: t('Invalid name', { message: t('LONG_NAME_DESC') }),
          },
          { validator: this.nameValidator },
        ]

    return (
      <Form data={formTemplate} ref={formRef}>
        <Columns>
          <Column>
            <Form.Item
              label={t('Name')}
              desc={t('LONG_NAME_DESC')}
              rules={rules}
            >
              <Input
                name="name"
                onChange={this.handleNameChange}
                maxLength={253}
                readOnly={isEdit}
              />
            </Form.Item>
          </Column>
          <Column>
            <Form.Item label={t('Alias')} desc={t('ALIAS_DESC')}>
              <Input name="annotations.aliasName" maxLength={63} />
            </Form.Item>
          </Column>
        </Columns>
        <Columns>
          <Column>
            <Form.Item
              label={`${t('Alerting Duration')}(${t('Minutes')})`}
              desc={t('ALERTING_DURATION')}
              rules={[{ validator: this.timeValidator }]}
            >
              <UnitWrapper name="duration" unit="m">
                <Select options={this.durationOptions} searchable />
              </UnitWrapper>
            </Form.Item>
          </Column>
          <Column>
            <Form.Item label={t('Alerting Type')}>
              <Select name="labels.severity" options={this.severities} />
            </Form.Item>
          </Column>
        </Columns>
        <Columns>
          <Column>
            <Form.Item label={t('Description')} desc={t('DESCRIPTION_DESC')}>
              <TextArea name="annotations.description" maxLength={256} />
            </Form.Item>
          </Column>
        </Columns>
      </Form>
    )
  }
}
