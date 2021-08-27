import React from 'react'
import { get } from 'lodash'
import { MODULE_KIND_MAP } from 'utils/constants'

import { Form } from '@kube-design/components'

import Metadata from './Metadata'

export default class AdvancedSettings extends React.Component {
  get cluster() {
    return this.props.cluster
  }

  get namespace() {
    return get(this.formTemplate, 'metadata.namespace')
  }

  get formTemplate() {
    const { formTemplate, module } = this.props
    return get(formTemplate, MODULE_KIND_MAP[module], formTemplate)
  }

  get fedFormTemplate() {
    return this.props.isFederated
      ? get(this.formTemplate, 'spec.template')
      : this.formTemplate
  }

  render() {
    const { store, formRef } = this.props
    return (
      <Form data={this.fedFormTemplate} ref={formRef}>
        <Form.Group
          label={t('Add Metadata')}
          desc={t(
            'Additional metadata settings for resources such as Labels and Annotations.'
          )}
          keepDataWhenUnCheck
          checkable
        >
          <Metadata
            store={store}
            cluster={this.cluster}
            namespace={this.namespace}
            formTemplate={this.fedFormTemplate}
          />
        </Form.Group>
      </Form>
    )
  }
}
