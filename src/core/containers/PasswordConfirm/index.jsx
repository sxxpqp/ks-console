import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import {
  Alert,
  Button,
  Icon,
  Form,
  InputPassword,
} from '@kube-design/components'
import { get } from 'lodash'
import UserStore from 'stores/user'
import { PATTERN_PASSWORD } from 'utils/constants'

import styles from './index.scss'

const PATTERN_WORD = /(?=.*?[A-Z])(?=.*?[a-z])/
const PATTERN_NUMBER = /(?=.*?[0-9])/

@inject('rootStore')
@observer
export default class PasswordConfirm extends Component {
  state = {
    formData: {},
    password: '',
  }

  store = new UserStore()

  handleSubmit = data => {
    this.store
      .jsonPatch({ name: get(globals, 'user.username') }, [
        {
          op: 'remove',
          path: '/metadata/annotations/iam.kubesphere.io~1uninitialized',
        },
        {
          op: 'replace',
          path: '/spec/password',
          value: data.password,
        },
      ])
      .then(() => {
        this.props.rootStore.routing.push('/')
      })
  }

  handleSkip = () => {
    this.store
      .jsonPatch({ name: get(globals, 'user.username') }, [
        {
          op: 'remove',
          path: '/metadata/annotations/iam.kubesphere.io~1uninitialized',
        },
      ])
      .then(() => {
        this.props.rootStore.routing.push('/')
      })
  }

  handlePasswordChange = value => {
    this.setState({ password: value })
  }

  render() {
    const { formData, password } = this.state

    return (
      <div>
        <a href="#" className={styles.logo}>
          <img src="/assets/logo.svg" alt="" />
        </a>
        <div className={styles.login}>
          <div className={styles.header}>{t('Please reset your password')}</div>
          <div className={styles.divider}></div>
          <Alert className="margin-b12" message={t('CONFIRM_PASSWORD_TIP')} />
          <Form data={formData} onSubmit={this.handleSubmit}>
            <Form.Item
              label={t('Password')}
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
                onChange={this.handlePasswordChange}
              />
            </Form.Item>
            <div className={styles.tip}>
              <p>{t('Your password must meet the following requirements')}</p>
              <div className={styles.strength}>
                <div>
                  <Icon
                    name="success"
                    type={PATTERN_WORD.test(password) ? 'coloured' : 'dark'}
                  />
                  {t('At least 1 uppercase and lowercase letter')}
                </div>
                <div>
                  <Icon
                    name="success"
                    type="dark"
                    type={PATTERN_NUMBER.test(password) ? 'coloured' : 'dark'}
                  />
                  {t('At least 1 number')}
                </div>
                <div>
                  <Icon
                    name="success"
                    type={password.length >= 6 ? 'coloured' : 'dark'}
                  />
                  {t('Password length is at least 6 characters')}
                </div>
              </div>
            </div>
            <div className={styles.footer}>
              <Button
                type="control"
                htmlType="submit"
                loading={this.store.isSubmmiting}
              >
                {t('Submit')}
              </Button>
              <Button type="flat" onClick={this.handleSkip}>
                {t('Modify Later')}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    )
  }
}
