import { get, set, debounce } from 'lodash'
import React from 'react'
import { PropTypes } from 'prop-types'
import { Form, Input, TextArea } from '@kube-design/components'
// import { Form, Input, Select, TextArea } from '@kube-design/components'
import {
  PATTERN_NAME,
  PATTERN_SERVICE_VERSION,
  PATTERN_APP_NAME,
} from 'utils/constants'
import {
  updateFederatedAnnotations,
  generateId,
  genName,
  turnName,
} from 'utils'
import styles from './index.scss'

export default class BaseInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      metaName: '',
    }
  }

  static propTypes = {
    onLabelsChange: PropTypes.func,
  }

  static defaultProps = {
    onLabelsChange() {},
  }

  get formTemplate() {
    return this.props.formData.application
  }

  get fedFormTemplate() {
    return this.props.isFederated
      ? get(this.formTemplate, 'spec.template')
      : this.formTemplate
  }

  get governances() {
    return [
      { label: t('On'), value: 'true' },
      { label: t('Off'), value: 'false' },
    ]
  }

  nameValidator = (rule, value, callback) => {
    if (!value) {
      return callback()
    }

    this.props.store
      .checkName({
        name: value,
        namespace: this.props.namespace,
        cluster: this.props.cluster,
      })
      .then(resp => {
        if (resp.exist) {
          return callback({
            message: t('Name exists'),
            field: rule.field,
          })
        }
        callback()
      })
  }

  // 名称变化
  handleNameChange = debounce(value => {
    set(this.formTemplate, 'metadata.labels["app.kubernetes.io/name"]', value)
    set(
      this.fedFormTemplate,
      'metadata.labels["app.kubernetes.io/name"]',
      value
    )
    set(
      this.fedFormTemplate,
      'spec.selector.matchLabels["app.kubernetes.io/name"]',
      value
    )
    this.props.onLabelsChange(
      get(this.fedFormTemplate, 'spec.selector.matchLabels')
    )

    set(
      this.props.formData,
      'ingress.metadata.name',
      `${value}-ingress-${generateId()}`
    )

    if (this.props.isFederated) {
      updateFederatedAnnotations(this.formTemplate)
    }
  }, 200)

  handleVersionChange = debounce(value => {
    set(
      this.fedFormTemplate,
      'spec.selector.matchLabels["app.kubernetes.io/version"]',
      value
    )
    this.props.onLabelsChange(
      get(this.fedFormTemplate, 'spec.selector.matchLabels')
    )
  }, 200)

  handleGovernanceChange = value => {
    this.props.onGovernanceChange(value)
    if (this.props.isFederated) {
      updateFederatedAnnotations(this.formTemplate)
    }
  }

  handleAliasChange(value) {
    // 自动唯一标识
    const tempName = `${turnName(value)}-${genName(6)}`
    set(this.formTemplate, 'metadata.name', tempName)
    this.setState({
      metaName: tempName,
    })
    this.handleNameChange(tempName)
  }

  render() {
    // const { formRef, serviceMeshEnable } = this.props
    const { formRef } = this.props
    const { metaName } = this.state
    return (
      <div className={styles.wrapper}>
        <div className={styles.step}>
          <div>{t('Basic Info')}</div>
          <p>{t('APPLICATION_BASEINFO_DESC')}</p>
        </div>
        <Form data={this.formTemplate} ref={formRef}>
          <Form.Item
            label={t('Application Name')}
            desc={'请输入应用的名称，支持中文&字母打头，最长16个字符'}
            rules={[
              { required: true, message: '请输入应用名称' },
              {
                pattern: PATTERN_APP_NAME,
                message: t('Invalid name', {
                  message: '应用名称只支持中文或者英文字母打头',
                }),
              },
            ]}
          >
            <Input
              name="metadata.annotations['kubesphere.io/alias-name']"
              maxLength={16}
              onChange={this.handleAliasChange.bind(this)}
            />
          </Form.Item>
          <Form.Item
            label={t('Application Version(Optional)')}
            desc={`${t('COMPONENT_VERSION_DESC')}`}
            rules={[
              {
                pattern: PATTERN_SERVICE_VERSION,
                message: t('COMPONENT_VERSION_DESC'),
              },
            ]}
          >
            <Input
              name="metadata.labels['app.kubernetes.io/version']"
              onChange={this.handleVersionChange}
              maxLength={16}
            />
          </Form.Item>
          {/* <Form.Item
            label={t('Application Governance')}
            desc={t.html('APP_GOVERNANCE_DESC')}
          >
            <Select
              name="metadata.annotations['servicemesh.kubesphere.io/enabled']"
              options={this.governances}
              onChange={this.handleGovernanceChange}
              disabled={!serviceMeshEnable}
            />
          </Form.Item> */}
          <Form.Item label={t('Description')} desc={t('DESCRIPTION_DESC')}>
            <TextArea
              name="metadata.annotations['kubesphere.io/description']"
              maxLength={256}
            />
          </Form.Item>
          <Form.Item
            className="hidden"
            label="应用标识"
            rules={[
              {
                required: true,
                message: t('Please input an application name'),
              },
              {
                pattern: PATTERN_NAME,
                message: t('Invalid name', {
                  message: t('NAME_DESC'),
                }),
              },
              { validator: this.nameValidator },
            ]}
          >
            <Input
              name="metadata.name"
              onChange={this.handleNameChange}
              maxLength={63}
              value={metaName}
            />
          </Form.Item>
        </Form>
      </div>
    )
  }
}
