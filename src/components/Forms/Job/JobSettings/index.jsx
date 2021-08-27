import React from 'react'
import { get } from 'lodash'
import { Column, Columns, Form } from '@kube-design/components'
import { NumberInput } from 'components/Inputs'
import { MODULE_KIND_MAP } from 'utils/constants'

export default class JobSettings extends React.Component {
  get prefix() {
    return this.props.prefix || 'spec.'
  }

  get formTemplate() {
    const { formTemplate, module } = this.props
    return get(formTemplate, MODULE_KIND_MAP[module], formTemplate)
  }

  render() {
    const { formRef } = this.props

    return (
      <Form data={this.formTemplate} ref={formRef}>
        <Columns>
          <Column>
            <Form.Item
              label={t('JOB_BACK_OFF_LIMIT_LABEL')}
              desc={t('JOB_BACK_OFF_LIMIT_DESC')}
            >
              <NumberInput
                min={0}
                name={`${this.prefix}backoffLimit`}
                integer
              />
            </Form.Item>
            <Form.Item
              label={t('JOB_PARALLELISM_LABEL')}
              desc={t('JOB_PARALLELISM_DESC')}
            >
              <NumberInput min={0} name={`${this.prefix}parallelism`} integer />
            </Form.Item>
          </Column>
          <Column>
            <Form.Item
              label={t('JOB_COMPLETION_LABEL')}
              desc={t('JOB_COMPLETION_DESC')}
            >
              <NumberInput min={0} name={`${this.prefix}completions`} integer />
            </Form.Item>
            <Form.Item
              label={t('JOB_ACTIVE_DL_SECONDS_LABEL')}
              desc={t('JOB_ACTIVE_DL_SECONDS')}
            >
              <NumberInput
                min={0}
                name={`${this.prefix}activeDeadlineSeconds`}
                integer
              />
            </Form.Item>
          </Column>
        </Columns>
      </Form>
    )
  }
}
