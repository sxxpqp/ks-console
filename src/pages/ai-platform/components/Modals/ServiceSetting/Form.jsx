import React from 'react'

import Base from 'components/Forms/Service/ServiceSettings'

import { Form } from '@kube-design/components'
import { TypeSelect } from 'components/Base'

export default class ServiceSettingsForm extends Base {
  renderTypeSelect() {
    return (
      <Form.Item label={t('Access Type')}>
        <TypeSelect
          className="margin-b12"
          value={this.state.serviceType}
          onChange={this.handleTypeChange}
          options={this.types}
          disabled
        />
      </Form.Item>
    )
  }
}
