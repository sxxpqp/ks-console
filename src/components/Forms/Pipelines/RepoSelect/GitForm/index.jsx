import React from 'react'
import { observer } from 'mobx-react'
import { pick } from 'lodash'
import { Form, Input, Select, Tag } from '@kube-design/components'
import styles from './index.scss'

@observer
export default class GitForm extends React.Component {
  getCredentialsListData = params => {
    const { devops, cluster } = this.props
    return this.props.store.getCredentials({ devops, cluster, ...params })
  }

  getCredentialsList = () => {
    return [
      ...this.props.store.credentials.data.map(credential => ({
        label: credential.name,
        value: credential.name,
        type: credential.type,
      })),
    ]
  }

  optionRender = ({ label, type, disabled }) => (
    <span style={{ display: 'flex', alignItem: 'center' }}>
      {label}&nbsp;&nbsp;
      <Tag type={disabled ? '' : 'warning'}>
        {type === 'ssh' ? 'SSH' : t(type)}
      </Tag>
    </span>
  )

  render() {
    const { formData, credentials } = this.props.store
    const { formRef } = this.props
    return (
      <div className={styles.card}>
        <Form data={formData} ref={formRef}>
          <Form.Item
            label={t('Repository Url')}
            desc={t(
              'Any repository containing Jenkinsfile will be built automatically.'
            )}
            rules={[{ required: true, message: t('This param is required') }]}
          >
            <Input name="git_source.url" />
          </Form.Item>
          <Form.Item
            label={t('Credential')}
            desc={
              <p>
                {t('ADD_NEW_CREDENTIAL_DESC')}
                <span
                  className={styles.clickable}
                  onClick={this.props.showCredential}
                >
                  {t('Create a credential')}
                </span>
              </p>
            }
          >
            <Select
              name="git_source.credential_id"
              options={this.getCredentialsList()}
              pagination={pick(credentials, ['page', 'limit', 'total'])}
              isLoading={credentials.isLoading}
              onFetch={this.getCredentialsListData}
              optionRenderer={this.optionRender}
              valueRenderer={this.optionRender}
              searchable
              clearable
            />
          </Form.Item>
        </Form>
      </div>
    )
  }
}
