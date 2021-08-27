import React from 'react'
import PropTypes from 'prop-types'
import { Alert, Form } from '@kube-design/components'
import { InputPassword } from 'components/Inputs'
import { PATTERN_PASSWORD } from 'utils/constants'

import styles from './index.scss'

export default class PasswordSetting extends React.Component {
  static contextTypes = {
    registerUpdate: PropTypes.func,
  }

  constructor(props) {
    super(props)

    this.state = {
      password: '',
      formData: this.getInitialData(),
    }
  }

  get name() {
    return 'passwordSetting'
  }

  getInitialData() {
    return {}
  }

  resetData = () => {
    this.setState({
      formData: this.getInitialData(),
    })
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

  handleFormChange = (name, value) => {
    this.context.registerUpdate(this.name, { name, value })
  }

  render() {
    const { formRef } = this.props
    return (
      <div className={styles.wrapper}>
        <div className="h4">{t('Password Setting')}</div>
        <Form
          data={this.state.formData}
          ref={formRef}
          onChange={this.handleFormChange}
        >
          <input
            name="password"
            className="hidden-input"
            type="password"
            disabled
          />
          <Form.Item
            className={styles.password}
            label={t('Current Password')}
            desc={t(
              'You must enter the correct current password to change to a new password.'
            )}
            rules={[
              { required: true, message: t('Please input current password') },
            ]}
          >
            <InputPassword
              name="currentPassword"
              placeholder={t('Please input current password')}
              autoComplete="cur-password"
            />
          </Form.Item>
          <Alert
            className={styles.alert}
            type="warning"
            message={t('PASSWORD_DESC')}
          />
          <Form.Item
            className={styles.password}
            label={t('New Password')}
            rules={[
              { required: true, message: t('Please input password') },
              {
                pattern: PATTERN_PASSWORD,
                message: t('PASSWORD_DESC'),
              },
            ]}
          >
            <InputPassword
              name="password"
              placeholder={t('Please input password')}
              autoComplete="new-password"
              onChange={this.handlePassswordChange}
              tipClassName={styles.dropdown}
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
        </Form>
      </div>
    )
  }
}
