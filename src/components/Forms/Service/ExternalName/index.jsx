import { get, set } from 'lodash'
import React from 'react'
import { Form, Input } from '@kube-design/components'
import { MODULE_KIND_MAP } from 'utils/constants'

export default class ServiceSettings extends React.Component {
  get formTemplate() {
    const { formTemplate, module } = this.props
    return get(formTemplate, MODULE_KIND_MAP[module], formTemplate)
  }

  componentDidMount() {
    if (get(this.formTemplate, 'spec.type') !== 'ExternalName') {
      set(this.formTemplate, 'spec', { type: 'ExternalName' })
    }
  }

  render() {
    const { formRef } = this.props

    return (
      <Form data={this.formTemplate} ref={formRef}>
        <Form.Item
          label={t('ExternalName')}
          desc={t('SERVICE_EXTERNAL_NAME_DESC')}
          rules={[
            {
              required: true,
              message: t('Please input ExternalName'),
            },
          ]}
        >
          <Input
            name="spec.externalName"
            placeholder={`${t('Example')}：foo.bar.example.com`}
          />
        </Form.Item>
      </Form>
    )
  }
}
