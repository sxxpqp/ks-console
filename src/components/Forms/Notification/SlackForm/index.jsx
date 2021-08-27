import React, { Component } from 'react'
import { get } from 'lodash'

import { Form, Button, Input, Alert } from '@kube-design/components'
import { ToggleField } from 'components/Base'
import Item from './Item'

import styles from './index.scss'

export default class SlackForm extends Component {
  formRef = React.createRef()

  handleSubmit = () => {
    const form = this.formRef.current
    form &&
      form.validate(() => {
        this.props.onSubmit(form.getData())
      })
  }

  render() {
    return (
      <Form
        ref={this.formRef}
        data={this.props.data}
        onChange={this.props.onChange}
      >
        <div className={styles.formBody}>
          {this.renderTips()}
          {this.renderFormItems()}
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
          message={t('SLACK_SETTINGS_CHANGE_NEED_SAVE_TIP')}
        />
      )
    }
    return null
  }

  renderFormItems() {
    const { data } = this.props
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
                name="receiver.spec.slack.enabled"
                value={get(data, 'receiver.spec.slack.enabled')}
                onText={t('On')}
                offText={t('Off')}
              />
            </Form.Item>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.title}>{t('Server Settings')}</div>
          <div className={styles.item}>
            <Form.Item
              label={t('Slack Token')}
              rules={[
                { required: true, message: t('Please enter the Slack token') },
              ]}
            >
              <Input name="secret.data.token" />
            </Form.Item>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.title}>{t('Channel Settings')}</div>
          <div className={styles.item}>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: t('Please add the receiver channel'),
                },
              ]}
            >
              <Item name="receiver.spec.slack.channels" />
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
