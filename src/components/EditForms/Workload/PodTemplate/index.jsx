import React from 'react'

import { Form } from '@kube-design/components'
import Base from 'components/Forms/Workload/ContainerSettings'

export default class PodTemplate extends Base {
  get formTemplate() {
    return this.props.formTemplate
  }

  handleContainer = data => {
    const { formProps } = this.props
    Base.prototype.handleContainer.call(this, data)

    formProps.onChange()
  }

  render() {
    const { formRef, formProps } = this.props
    const { showContainer, selectContainer } = this.state

    if (showContainer) {
      return this.renderContainerForm(selectContainer)
    }

    return (
      <Form data={this.formTemplate} ref={formRef} {...formProps}>
        {this.renderContainerList()}
      </Form>
    )
  }
}
