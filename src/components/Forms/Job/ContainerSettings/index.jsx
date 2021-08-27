import React from 'react'
import { observer } from 'mobx-react'
import { Form, Select } from '@kube-design/components'
import Base from 'components/Forms/Workload/ContainerSettings'

@observer
export default class PodTemplate extends Base {
  getRestartPolicyOptions() {
    return [
      {
        label: `Never (${t('RESTART_POLICY_NEVER_DESC')})`,
        value: 'Never',
      },
      {
        label: `OnFailure (${t('RESTART_POLICY_ONFAILURE_DESC')})`,
        value: 'OnFailure',
      },
    ]
  }

  renderRestartPolicy() {
    return (
      <Form.Item
        label={t('Restart Policy')}
        tip={t.html('RESTART_POLICY_TIP')}
        desc={`${t('Restart Policy')} (Never/OnFailure)`}
      >
        <Select
          name={`${this.prefix}spec.restartPolicy`}
          options={this.getRestartPolicyOptions()}
        />
      </Form.Item>
    )
  }

  render() {
    const { formRef } = this.props
    const { showContainer, selectContainer } = this.state

    if (showContainer) {
      return this.renderContainerForm(selectContainer)
    }

    return (
      <Form data={this.formTemplate} ref={formRef}>
        {this.renderRestartPolicy()}
        {this.renderContainerList()}
      </Form>
    )
  }
}
