import React from 'react'
import { get } from 'lodash'
import { Column, Columns, Form, Input, TextArea } from '@kube-design/components'
import { MODULE_KIND_MAP, PATTERN_NAME } from 'utils/constants'

export default class BaseInfo extends React.Component {
  get formTemplate() {
    const { formTemplate, module } = this.props
    return get(formTemplate, MODULE_KIND_MAP[module], formTemplate)
  }

  nameValidator = (rule, value, callback) => {
    if (!value) {
      return callback()
    }

    this.props.store
      .checkName({
        name: value,
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
      <div>
        <Form data={this.formTemplate} ref={formRef}>
          <Columns>
            <Column>
              <Form.Item
                label={t('Name')}
                desc={t('NAME_DESC')}
                rules={[
                  { required: true, message: t('Please input name') },
                  {
                    pattern: PATTERN_NAME,
                    message: t('Invalid name', { message: t('NAME_DESC') }),
                  },
                  { validator: this.nameValidator },
                ]}
              >
                <Input name="metadata.name" autoFocus={true} maxLength={63} />
              </Form.Item>
            </Column>
            <Column>
              <Form.Item label={t('Alias')} desc={t('ALIAS_DESC')}>
                <Input
                  name="metadata.annotations['kubesphere.io/alias-name']"
                  maxLength={63}
                />
              </Form.Item>
            </Column>
          </Columns>
          <Columns>
            <Column>
              <Form.Item label={t('Description')} desc={t('DESCRIPTION_DESC')}>
                <TextArea
                  name="metadata.annotations['kubesphere.io/description']"
                  maxLength={256}
                />
              </Form.Item>
            </Column>
          </Columns>
        </Form>
      </div>
    )
  }
}
