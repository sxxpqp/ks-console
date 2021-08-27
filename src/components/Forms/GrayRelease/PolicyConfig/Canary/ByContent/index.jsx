import { get, isEmpty, unset } from 'lodash'
import React from 'react'
import { Form } from '@kube-design/components'

import { GRAY_RELEASE_CANARY_CONTENT } from 'utils/constants'
import CookieMatch from '../CookieMatch'
import HeaderMatch from '../HeaderMatch'
import OSSelect from '../OSSelect'

import styles from './index.scss'

export default class ByContent extends React.Component {
  get formTemplate() {
    return this.props.formTemplate.strategy
  }

  get prefix() {
    const protocol = get(this.formTemplate, 'spec.protocol', 'http')

    return `spec.template.spec.${protocol}[0]`
  }

  handleCookieChange = value => {
    // make HeaderMatch get the newest value
    this.setState({ cookie: value })
  }

  handleFormChange = (name, value) => {
    // unset empty option
    if (name === `${this.prefix}.match[0].headers.cookie`) {
      if (isEmpty(Object.values(value)[0])) {
        unset(this.formTemplate, name)
      }
    } else if (name === `${this.prefix}.match[0].headers`) {
      if (isEmpty(Object.keys(value)[0])) {
        unset(this.formTemplate, name)
      }
    } else if (name === `${this.prefix}.match[0].uri`) {
      if (isEmpty(Object.values(value)[0])) {
        unset(this.formTemplate, name)
      }
    } else if (name === `${this.prefix}.match[0].headers['User-Agent'].regex`) {
      if (isEmpty(value)) {
        unset(
          this.formTemplate,
          `${this.prefix}.match[0].headers['User-Agent']`
        )
      }
    }
  }

  render() {
    const { formRef, formTemplate, ...rest } = this.props
    return (
      <div className={styles.wrapper}>
        <div className={styles.item}>
          <div className={styles.title}>{t('Rule Description')}</div>
          <p>{t('GRAY_RELEASE_BY_CONTENT_TIP')}</p>
        </div>
        <div className={styles.item}>
          <div className={styles.title}>
            {t('Grayscale release version access rule')}
          </div>
          <Form
            ref={formRef}
            data={this.formTemplate}
            onChange={this.handleFormChange}
            {...rest}
          >
            <Form.Item label={t('Cookie')}>
              <CookieMatch
                name={`${this.prefix}.match[0].headers.cookie`}
                onChange={this.handleCookieChange}
                placeholder="key=value"
              />
            </Form.Item>
            <Form.Item label={t('Custom Header')}>
              <HeaderMatch name={`${this.prefix}.match[0].headers`} />
            </Form.Item>
            <Form.Item label={t('URI')}>
              <CookieMatch
                name={`${this.prefix}.match[0].uri`}
                placeholder="URI"
                matchTypes={['prefix', 'regex']}
              />
            </Form.Item>
            <Form.Item
              label={t('Traffic comes from the following operating systems')}
            >
              <OSSelect
                name={`${this.prefix}.match[0].headers['User-Agent'].regex`}
                options={GRAY_RELEASE_CANARY_CONTENT}
              />
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }
}
