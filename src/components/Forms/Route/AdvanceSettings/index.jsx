import React from 'react'
import { get } from 'lodash'
import { MODULE_KIND_MAP } from 'utils/constants'

import { Form } from '@kube-design/components'

import Metadata from './Metadata'

export default class AdvancedSettings extends React.Component {
  get formTemplate() {
    const { formTemplate, module } = this.props
    return get(formTemplate, MODULE_KIND_MAP[module], formTemplate)
  }

  render() {
    const { formRef } = this.props
    return (
      <Form data={this.formTemplate} ref={formRef}>
        <Form.Group
          label={t('Add Metadata')}
          desc={t(
            'Additional metadata settings for resources such as Labels and Annotations.'
          )}
          keepDataWhenUnCheck
          checkable
        >
          <Metadata />
        </Form.Group>
      </Form>
    )
  }
}
