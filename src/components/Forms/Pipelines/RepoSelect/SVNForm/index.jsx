import React from 'react'
import { pick } from 'lodash'
import { Form, Input, Select, Tag } from '@kube-design/components'
import { observer } from 'mobx-react'

import styles from './index.scss'

@observer
export default class SvnForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { type: 'svn' }
  }

  handleTypeChange = value => {
    this.setState({ type: value })
  }

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
    const { formRef, enableTypeChange } = this.props

    return (
      <div className={styles.card}>
        <Form data={formData} ref={formRef}>
          <Form.Item label={t('type')}>
            <Select
              name="svn_source.type"
              disabled={enableTypeChange === false}
              onChange={this.handleTypeChange}
              options={[
                { label: t('single Svn'), value: 'single_svn' },
                { label: 'svn', value: 'svn' },
              ]}
              defaultValue={'svn'}
            />
          </Form.Item>
          <Form.Item
            label={t('Remote Repository URL')}
            rules={[{ required: true, message: t('This param is required') }]}
          >
            <Input name="svn_source.remote" />
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
            rules={[{ required: true, message: t('This param is required') }]}
          >
            <Select
              name="svn_source.credential_id"
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
          {this.state.type !== 'single_svn' ? (
            <React.Fragment>
              <Form.Item label={t('Branch Included')}>
                <Input
                  name="svn_source.includes"
                  defaultValue="trunk,branches/*,tags/*,sandbox/*"
                />
              </Form.Item>
              <Form.Item label={t('Branch Excluded')}>
                <Input name="svn_source.excludes" />
              </Form.Item>
            </React.Fragment>
          ) : null}
        </Form>
      </div>
    )
  }
}
