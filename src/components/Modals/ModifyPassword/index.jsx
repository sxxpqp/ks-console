import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Form, Input } from '@kube-design/components'
import { Modal } from 'components/Base'
import { InputPassword } from 'components/Inputs'
import { PATTERN_PASSWORD } from 'utils/constants'

import styles from './index.scss'

export default class ModifyPasswordModal extends Component {
  static propTypes = {
    detail: PropTypes.object,
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  }

  static defaultProps = {
    visible: false,
    onOk() {},
    onCancel() {},
  }

  state = {
    password: '',
    formData: {},
  }

  handlePassswordChange = value => {
    this.setState({ password: value })
  }

  passwordValidator = (rule, value, callback) => {
    if (!value) {
      return callback()
    }

    if (value !== this.state.password) {
      callback({
        message: t('The password entered twice must be the same'),
        field: rule.field,
      })
    }

    callback()
  }

  render() {
    const { detail, ...rest } = this.props

    return (
      <Modal.Form
        title={t('Change Password')}
        icon="pen"
        width={691}
        data={this.state.formData}
        {...rest}
      >
        <input name="username" className="hidden-input" type="text" disabled />
        <input
          name="password"
          className="hidden-input"
          type="password"
          disabled
        />
        <Form.Item label={t('Email')}>
          <Input disabled value={detail.email} />
        </Form.Item>
        <Form.Item
          className={styles.password}
          label={t('New Password')}
          rules={[
            { required: true, message: t('Please input password') },
            { pattern: PATTERN_PASSWORD, message: t('PASSWORD_DESC') },
          ]}
        >
          <InputPassword
            name="password"
            placeholder={t('Please input password')}
            autoComplete="new-password"
            onChange={this.handlePassswordChange}
            withStrength
          />
        </Form.Item>
        <Form.Item
          className={styles.password}
          label={t('Repeat the New Password')}
          rules={[
            { required: true, message: t('Please repeat the new password') },
            { validator: this.passwordValidator },
          ]}
        >
          <InputPassword
            name="rePassword"
            placeholder={t('Please repeat the new password')}
            autoComplete="new-password"
          />
        </Form.Item>
        <div style={{ height: 200 }} />
      </Modal.Form>
    )
  }
}
