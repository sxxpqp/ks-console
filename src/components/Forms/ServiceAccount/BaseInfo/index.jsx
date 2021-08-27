import React from 'react'
import { observer } from 'mobx-react'
import { get, set } from 'lodash'

import { Columns, Column, Form, Input, TextArea } from '@kube-design/components'
import { ProjectSelect, RoleSelect } from 'components/Inputs'

import { PATTERN_NAME, MODULE_KIND_MAP } from 'utils/constants'
import RoleStore from 'stores/role'

@observer
export default class BaseInfo extends React.Component {
  roleStore = new RoleStore()

  constructor(props) {
    super(props)

    this.state = {
      cluster: props.cluster,
      workspace: props.workspace,
      namespace: props.namespace,
    }
  }

  get formTemplate() {
    const { formTemplate, module } = this.props
    return get(formTemplate, MODULE_KIND_MAP[module], formTemplate)
  }

  nameValidator = (rule, value, callback) => {
    if (!value) {
      return callback()
    }

    this.props.store
      .checkName({
        name: value,
        namespace: this.state.namespace,
        cluster: this.state.cluster,
      })
      .then(resp => {
        if (resp.exist) {
          return callback({ message: t('Name exists'), field: rule.field })
        }
        callback()
      })
  }

  handleChange = value => {
    set(this.formTemplate, 'metadata.annotations["iam.kubesphere.io/role"]', '')
    this.setState({ namespace: value })
  }

  render() {
    const { formRef } = this.props
    const { cluster, namespace } = this.state

    return (
      <Form data={this.formTemplate} ref={formRef}>
        <Columns>
          <Column>
            <Form.Item
              label={t('Name')}
              desc={t('NAME_DESC')}
              rules={[
                { required: true, message: t('Please input name') },
                {
                  pattern: PATTERN_NAME,
                  message: t('Invalid name', { message: t('NAME_DESC') }),
                },
                { validator: this.nameValidator },
              ]}
            >
              <Input name="metadata.name" autoFocus={true} maxLength={63} />
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
                  onChange={this.handleChange}
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
        <Columns>
          <Column>
            <Form.Item label={t('Project Role')} desc={t('PROJECT_ROLE_DESC')}>
              <RoleSelect
                name="metadata.annotations['iam.kubesphere.io/role']"
                cluster={cluster}
                namespace={namespace}
              />
            </Form.Item>
          </Column>
        </Columns>
      </Form>
    )
  }
}
