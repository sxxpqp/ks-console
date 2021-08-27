import React, { Component } from 'react'
import { get } from 'lodash'

import {
  Form,
  Button,
  Input,
  Alert,
  Select,
  Checkbox,
} from '@kube-design/components'
import { ToggleField } from 'components/Base'

import styles from './index.scss'

export default class WebhookReceiverForm extends Component {
  formRef = React.createRef()

  get options() {
    return [
      {
        label: 'No Auth',
        value: 'no',
      },
      {
        label: 'Bearer Token',
        value: 'token',
      },
      {
        label: 'Basic Auth',
        value: 'basic',
      },
    ]
  }

  handleSubmit = () => {
    const form = this.formRef.current
    form &&
      form.validate(() => {
        this.props.onSubmit(form.getData())
      })
  }

  render() {
    const { data, onChange } = this.props
    return (
      <Form ref={this.formRef} data={data} onChange={onChange}>
        <div className={styles.formBody}>
          <div className={styles.formAttrs}>
            {this.renderTips()}
            {this.renderFormItems()}
          </div>
        </div>
        <div className={styles.footer}>{this.renderFooterBtns()}</div>
      </Form>
    )
  }

  renderTips() {
    if (this.props.showTip && this.props.formStatus === 'update') {
      return (
        <Alert
          className={styles.tips}
          type="error"
          message={t('WEBHOOK_SETTINGS_CHANGE_NEED_SAVE_TIP')}
        />
      )
    }
    return null
  }

  renderFormItems() {
    const { data } = this.props
    const type = get(
      data,
      'receiver.metadata.annotations["kubesphere.io/verify-type"]'
    )
    return (
      <>
        <div className={styles.row}>
          <div className={styles.title}>{t('Notification Settings')}</div>
          <div className={styles.item}>
            <Form.Item
              className={styles.isHorizon}
              label={t('Receive Notification')}
            >
              <ToggleField
                name="receiver.spec.webhook.enabled"
                value={get(data, 'receiver.spec.webhook.enabled')}
                onText={t('On')}
                offText={t('Off')}
              />
            </Form.Item>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.title}>{t('Webhook Settings')}</div>
          <div className={styles.item}>
            <Form.Item
              label={t('URL')}
              rules={[{ required: true, message: t('Please input URL') }]}
            >
              <Input name="receiver.spec.webhook.url" />
            </Form.Item>
            <Form.Item
              label={t('Verification Type')}
              rules={[
                {
                  required: true,
                  message: t('Please select a verification type'),
                },
              ]}
            >
              <Select
                name="receiver.metadata.annotations['kubesphere.io/verify-type']"
                options={this.options}
              />
            </Form.Item>
            {type === 'basic' && (
              <>
                <Form.Item label={t('User Name')}>
                  <Input name="receiver.spec.webhook.httpConfig.basicAuth.username" />
                </Form.Item>
                <Form.Item label={t('Password')}>
                  <Input
                    name="secret.data.password"
                    type="password"
                    autoComplete="new-password"
                  />
                </Form.Item>
              </>
            )}
            {type === 'token' && (
              <>
                <Form.Item label={t('Token')}>
                  <Input name="secret.data.token" />
                </Form.Item>
              </>
            )}
            <Form.Item>
              <Checkbox
                name="receiver.spec.webhook.httpConfig.tlsConfig.insecureSkipVerify"
                checked={get(
                  data,
                  'receiver.spec.webhook.httpConfig.tlsConfig.insecureSkipVerify'
                )}
              >
                {t('Skip TLS Certification')}
              </Checkbox>
            </Form.Item>
          </div>
        </div>
      </>
    )
  }

  renderFooterBtns() {
    return (
      <>
        <Button onClick={this.props.onCancel}>{t('Cancel')}</Button>
        <Button
          type="control"
          loading={this.props.isSubmitting}
          disabled={this.props.disableSubmit}
          onClick={this.handleSubmit}
        >
          {this.props.formStatus === 'update' ? t('Update') : t('Save')}
        </Button>
      </>
    )
  }
}
