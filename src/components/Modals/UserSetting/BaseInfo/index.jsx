import React from 'react'
import PropTypes from 'prop-types'
import { Column, Columns, Form, Input, Select } from '@kube-design/components'
import { cloneDeep } from 'lodash'
import { getBrowserLang } from 'utils'
import cookie from 'utils/cookie'

import styles from './index.scss'

export default class BaseInfo extends React.Component {
  static contextTypes = {
    registerUpdate: PropTypes.func,
  }

  constructor(props) {
    super(props)

    this.state = {
      formData: this.getInitialData(),
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.formData !== this.props.formData) {
      this.setState({ formData: this.getInitialData() })
    }
  }

  get name() {
    return 'basicInfo'
  }

  getInitialData() {
    return cloneDeep(this.props.formData)
  }

  resetData = () => {
    this.setState({
      formData: this.getInitialData(),
    })
  }

  handleFormChange = (name, value) => {
    this.context.registerUpdate(this.name, { name, value })
  }

  render() {
    const { formRef } = this.props
    return (
      <div className={styles.wrapper}>
        <div className="h4">{t('Basic Info')}</div>
        <Form
          ref={formRef}
          data={this.state.formData}
          onChange={this.handleFormChange}
        >
          <Columns>
            <Column>
              <Form.Item label={t('User Name')}>
                <Input name="metadata.name" placeholder="username" disabled />
              </Form.Item>
              <Form.Item label={t('Email')} desc={t('USER_SETTING_EMAIL_DESC')}>
                <Input name="spec.email" placeholder="User@example.com" />
              </Form.Item>
              {globals.config.supportLangs && (
                <Form.Item label={t('Language')}>
                  <Select
                    name="spec.lang"
                    options={globals.config.supportLangs}
                    defaultValue={cookie('lang') || getBrowserLang()}
                  />
                </Form.Item>
              )}
            </Column>
          </Columns>
        </Form>
      </div>
    )
  }
}
