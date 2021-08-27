import React from 'react'

import { Form } from '@kube-design/components'
import UpdateStrategyForm from 'components/Forms/Workload/ContainerSettings/UpdateStrategy'

export default class UpdateStrategy extends React.Component {
  render() {
    const { formTemplate, formRef, formProps, module } = this.props

    return (
      <div className="margin-t12">
        <Form data={formTemplate} ref={formRef} {...formProps}>
          <UpdateStrategyForm module={module} data={formTemplate} />
        </Form>
      </div>
    )
  }
}
