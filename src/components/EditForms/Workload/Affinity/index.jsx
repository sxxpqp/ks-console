import React from 'react'

import { Form } from '@kube-design/components'
import AffinityForm from 'components/Forms/Workload/ContainerSettings/Affinity'

class Affinity extends React.Component {
  render() {
    const {
      formTemplate,
      formRef,
      formProps,
      module,
      cluster,
      namespace,
    } = this.props

    return (
      <div className="margin-t12">
        <Form data={formTemplate} ref={formRef} {...formProps}>
          <AffinityForm
            data={formTemplate}
            module={module}
            cluster={cluster}
            namespace={namespace}
          />
        </Form>
      </div>
    )
  }
}

export default Affinity
