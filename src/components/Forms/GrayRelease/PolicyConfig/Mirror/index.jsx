import React from 'react'
import { get, set, isEmpty } from 'lodash'
import { Alert, Form } from '@kube-design/components'

export default class Mirror extends React.Component {
  componentDidMount() {
    const { formTemplate } = this.props

    const host = get(formTemplate, 'strategy.spec.template.spec.hosts[0]')
    const oldVersion = get(formTemplate, 'strategy.spec.principal')
    const newVersion = get(formTemplate, 'workload.metadata.labels.version')

    const httpData = [
      {
        route: [{ destination: { subset: oldVersion, host }, weight: 100 }],
        mirror: { host, subset: newVersion },
      },
    ]

    // istio fix
    if (this.protocol === 'tcp') {
      httpData.forEach(item => {
        item.match = item.match || []
      })
    }

    if (isEmpty(get(this.formTemplate, this.strategyPath))) {
      set(this.formTemplate, this.strategyPath, httpData)
    }
  }

  get formTemplate() {
    return this.props.formTemplate.strategy
  }

  get protocol() {
    return get(this.formTemplate, 'spec.protocol', 'http')
  }

  get strategyPath() {
    return `spec.template.spec.${this.protocol}`
  }

  render() {
    const { formRef, formTemplate } = this.props
    return (
      <Form ref={formRef} data={formTemplate}>
        <Alert type="info" message={t.html('MIRROR_POLICY_DESC')} />
      </Form>
    )
  }
}
