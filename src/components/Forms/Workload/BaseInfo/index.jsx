import React from 'react'
import { get, set, debounce } from 'lodash'
import { observer } from 'mobx-react'

import { updateLabels } from 'utils'
import {
  PATTERN_NAME,
  MODULE_KIND_MAP,
  APP_LABEL_MODULES,
} from 'utils/constants'

import { Form, Columns, Column, Input, TextArea } from '@kube-design/components'
import { ProjectSelect } from 'components/Inputs'

@observer
export default class BaseInfo extends React.Component {
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

  nameValidator = (rule, value, callback) => {
    if (!value) {
      return callback()
    }

    this.props.store
      .checkName({
        name: value,
        namespace: this.namespace,
        cluster: this.cluster,
      })
      .then(resp => {
        if (resp.exist) {
          return callback({ message: t('Name exists'), field: rule.field })
        }
        callback()
      })
  }

  handleNameChange = debounce(value => {
    const { module, isFederated } = this.props

    const labels = get(this.fedFormTemplate, 'metadata.labels', {})

    if (APP_LABEL_MODULES.includes(module)) {
      labels.app = value.slice(0, 63)
    }

    updateLabels(this.fedFormTemplate, module, labels)

    if (isFederated && APP_LABEL_MODULES.includes(module)) {
      set(this.formTemplate, 'metadata.labels.app', value.slice(0, 63))
    }
  }, 200)

  render() {
    const { formRef, maxNameLength = 253 } = this.props

    const desc = maxNameLength === 253 ? t('LONG_NAME_DESC') : t('NAME_DESC')

    return (
      <Form data={this.formTemplate} ref={formRef}>
        <Columns>
          <Column>
            <Form.Item
              label={t('Name')}
              desc={desc}
              rules={[
                { required: true, message: t('Please input name') },
                {
                  pattern: PATTERN_NAME,
                  message: t('Invalid name', { message: desc }),
                },
                { validator: this.nameValidator },
              ]}
            >
              <Input
                name="metadata.name"
                onChange={this.handleNameChange}
                maxLength={maxNameLength}
                autoFocus={true}
              />
            </Form.Item>
          </Column>
          <Column>
            <Form.Item label={t('Alias')} desc={t('ALIAS_DESC')}>
              <Input
                name="metadata.annotations['kubesphere.io/alias-name']"
                maxLength={63}
              />
            </Form.Item>
          </Column>
        </Columns>
        <Columns>
          {!this.props.namespace && (
            <Column>
              <Form.Item
                label={t('Project')}
                desc={t('PROJECT_DESC')}
                rules={[
                  { required: true, message: t('Please select a project') },
                ]}
              >
                <ProjectSelect
                  name="metadata.namespace"
                  cluster={this.props.cluster}
                  defaultValue={this.namespace}
                />
              </Form.Item>
            </Column>
          )}
          <Column>
            <Form.Item label={t('Description')} desc={t('DESCRIPTION_DESC')}>
              <TextArea
                name="metadata.annotations['kubesphere.io/description']"
                maxLength={256}
              />
            </Form.Item>
          </Column>
        </Columns>
      </Form>
    )
  }
}
