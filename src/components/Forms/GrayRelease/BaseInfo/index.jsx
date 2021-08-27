import { get } from 'lodash'
import React from 'react'
import { observer } from 'mobx-react'

import { PATTERN_NAME } from 'utils/constants'

import { Column, Columns, Form, Input } from '@kube-design/components'

@observer
export default class BaseInfo extends React.Component {
  get formTemplate() {
    return this.props.formTemplate.strategy
  }

  get namespace() {
    return get(this.formTemplate, 'metadata.namespace')
  }

  get strategyType() {
    return get(this.formTemplate, 'spec.type')
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

  render() {
    const { formRef } = this.props

    return (
      <Form data={this.formTemplate} ref={formRef}>
        <Columns>
          <Column>
            <Form.Item
              label={t('Release Job Name')}
              desc={t('LONG_NAME_DESC')}
              rules={[
                { required: true, message: t('Please input name') },
                {
                  pattern: PATTERN_NAME,
                  message: t('Invalid name', { message: t('LONG_NAME_DESC') }),
                },
                { validator: this.nameValidator },
              ]}
            >
              <Input name="metadata.name" maxLength={253} />
            </Form.Item>
          </Column>
          <Column />
        </Columns>
      </Form>
    )
  }
}
