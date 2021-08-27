import React from 'react'
import { get } from 'lodash'
import { MODULE_KIND_MAP } from 'utils/constants'
import { Form } from '@kube-design/components'
import { AccessModes } from 'components/Inputs'

const ACCESSMODE_KEY = 'spec.accessModes[0]'
const supportedAccessModes = ['ReadWriteOnce', 'ReadOnlyMany', 'ReadWriteMany']

export default class VolumeSettings extends React.Component {
  get formTemplate() {
    const { formTemplate, module } = this.props
    return get(formTemplate, MODULE_KIND_MAP[module], formTemplate)
  }

  render() {
    const { formRef } = this.props

    return (
      <Form data={this.formTemplate} ref={formRef}>
        <Form.Item label={t('Access Mode')} rules={[{ required: true }]}>
          <AccessModes
            name={ACCESSMODE_KEY}
            defaultValue={get(supportedAccessModes, '[0]', '')}
            supportedAccessModes={supportedAccessModes}
          />
        </Form.Item>
      </Form>
    )
  }
}
