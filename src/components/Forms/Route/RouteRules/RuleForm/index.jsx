import { get, isEmpty } from 'lodash'
import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import {
  Alert,
  Form,
  Input,
  RadioButton,
  RadioGroup,
  Select,
} from '@kube-design/components'

import { ArrayInput, RulePath } from 'components/Inputs'

import { ReactComponent as BackIcon } from 'assets/back.svg'

import { PATTERN_HOST } from 'utils/constants'

import ClusterSelect from './ClusterSelect'

import styles from './index.scss'

export default class RuleForm extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    secrets: PropTypes.array,
    services: PropTypes.array,
    gateway: PropTypes.object,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
  }

  static defaultProps = {
    data: {},
    secrets: [],
    services: [],
    gateway: {},
    onSave() {},
    onCancel() {},
  }

  static contextTypes = {
    registerSubRoute: PropTypes.func,
    resetSubRoute: PropTypes.func,
  }

  constructor(props) {
    super(props)

    this.state = {
      type: this.enableAutoGenerated ? this.getType(props.data) : 'specify',
      service: '',
      protocol: get(props, 'data.protocol', 'http'),
    }

    this.formRef = React.createRef()
  }

  componentDidMount() {
    const { registerSubRoute } = this.context
    const { onCancel } = this.props

    registerSubRoute && registerSubRoute(this.handleSubmit, onCancel)
  }

  get protocols() {
    return [
      { label: t('http'), value: 'http' },
      { label: t('https'), value: 'https' },
    ]
  }

  get secrets() {
    return this.props.secrets.map(item => ({
      label: item.name,
      value: item.name,
    }))
  }

  get clusters() {
    return get(this.props, 'projectDetail.clusters', []).slice()
  }

  get defaultClusters() {
    return get(this.props, 'projectDetail.clusters', []).map(item => item.name)
  }

  get enableAutoGenerated() {
    const { isFederated, gateway } = this.props
    return !isFederated && !isEmpty(gateway)
  }

  getType(data) {
    const host = get(data, 'host')

    if (!host) {
      return 'auto'
    }

    const { gateway } = this.props
    const service = get(data, 'http.paths[0].backend.serviceName')
    const _host = gateway.isHostName
      ? gateway.defaultIngress
      : `${service}.${namespace}.${gateway.defaultIngress}.nip.io`
    const namespace = gateway.namespace

    return host === _host ? 'auto' : 'specify'
  }

  checkItemValid = item =>
    item.path &&
    item.backend &&
    item.backend.serviceName &&
    item.backend.servicePort

  pathValidator = (rule, value, callback) => {
    if (!value) {
      return callback()
    }

    if (value.some(item => !this.checkItemValid(item))) {
      return callback({ message: t('Invalid paths'), field: rule.field })
    }

    callback()
  }

  handleGoBack = () => {
    const { resetSubRoute } = this.context

    resetSubRoute && resetSubRoute()

    this.props.onCancel()
  }

  handleProtocolChange = value => {
    this.setState({ protocol: value })
  }

  handleModeChange = value => {
    this.setState({ type: value })
  }

  handleSubmit = callback => {
    const { onSave } = this.props
    const form = this.formRef.current

    form &&
      form.validate(() => {
        const data = form.getData()
        if (this.state.type === 'auto') {
          const { gateway } = this.props
          const service = get(data, 'http.paths[0].backend.serviceName')
          const namespace = gateway.namespace
          onSave({
            ...data,
            protocol: 'http',
            host: gateway.isHostName
              ? gateway.defaultIngress
              : `${service}.${namespace}.${gateway.defaultIngress}.nip.io`,
          })
        } else {
          onSave(data)
        }
        callback && callback()
      })
  }

  renderForm() {
    const { type, protocol } = this.state

    return (
      <>
        {type === 'specify' && (
          <>
            <Form.Item
              label={t('HostName')}
              rules={[
                { required: true, message: t('Please input Hostname') },
                {
                  pattern: PATTERN_HOST,
                  message: t('Invalid host'),
                },
              ]}
            >
              <Input name="host" autoFocus={true} />
            </Form.Item>
            <Form.Item label={t('Protocol')}>
              <Select
                name="protocol"
                defaultValue="http"
                onChange={this.handleProtocolChange}
                options={this.protocols}
              />
            </Form.Item>
            {protocol === 'https' && (
              <Form.Item label={t('Secret Name')}>
                <Select name="secretName" options={this.secrets} />
              </Form.Item>
            )}
          </>
        )}
        <Form.Item
          label={t('Paths')}
          rules={[
            { required: true, message: t('Please add a path') },
            { validator: this.pathValidator, checkOnSubmit: true },
          ]}
        >
          <ArrayInput
            name="http.paths"
            itemType="object"
            addText={t('Add Path')}
            checkItemValid={this.checkItemValid}
          >
            <RulePath services={this.props.services} />
          </ArrayInput>
        </Form.Item>
      </>
    )
  }

  render() {
    const { data, className, isFederated, gateway } = this.props
    const { type } = this.state

    return (
      <div className={classNames(styles.wrapper, className)}>
        <div className="h4">
          <a className="custom-icon" onClick={this.handleGoBack}>
            <BackIcon />
          </a>
          {t('Set Route Rule')}
        </div>
        <div className={styles.formWrapper}>
          <Form ref={this.formRef} data={data}>
            {isFederated && (
              <Form.Group label={t('Deployment Location')}>
                <Form.Item>
                  <ClusterSelect
                    name="clusters"
                    options={this.clusters}
                    defaultValue={this.defaultClusters}
                  />
                </Form.Item>
              </Form.Group>
            )}
            {!isFederated && isEmpty(gateway) && (
              <Alert
                className="margin-b12"
                message={t.html('NO_INTERNET_ACCESS_TIP')}
                type="warning"
              />
            )}
            <Form.Group noWrapper>
              {!isFederated && (
                <Form.Item label={t('Mode')}>
                  <RadioGroup
                    mode="button"
                    buttonWidth={155}
                    value={type}
                    onChange={this.handleModeChange}
                    size="small"
                  >
                    <RadioButton
                      value="auto"
                      disabled={!this.enableAutoGenerated}
                    >
                      {t('Auto Generate')}
                    </RadioButton>
                    <RadioButton value="specify">
                      {t('Specify Domain')}
                    </RadioButton>
                  </RadioGroup>
                </Form.Item>
              )}
              <Alert
                className="margin-t12 margin-b12"
                message={t.html(`RULE_SETTING_MODE_${type.toUpperCase()}`)}
                type="info"
              />
              {this.renderForm()}
            </Form.Group>
          </Form>
        </div>
      </div>
    )
  }
}
