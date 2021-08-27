import React from 'react'
import { get } from 'lodash'

import Base from 'components/Forms/Service/ServiceSettings'
import { Form, Input } from '@kube-design/components'
import { Label, TypeSelect } from 'components/Base'

import styles from './index.scss'

export default class ServiceSettingsForm extends Base {
  renderName() {
    return (
      <Form.Item label={t('Name')}>
        <Input name="metadata.name" disabled />
      </Form.Item>
    )
  }

  renderSelectorLabels() {
    const selectors = get(this.props.formTemplate, 'spec.selector', {})

    return (
      <Form.Item label={t('Selector')}>
        <div className={styles.selectors}>
          {Object.keys(selectors).map(key => (
            <Label key={key} name={key} value={selectors[key]} />
          ))}
        </div>
      </Form.Item>
    )
  }

  renderTypeSelect() {
    return (
      <Form.Item label={t('Access Type')}>
        <TypeSelect
          className="margin-b12"
          value={this.state.serviceType}
          onChange={this.handleTypeChange}
          options={this.types}
          disabled
        />
      </Form.Item>
    )
  }

  render() {
    const { formRef } = this.props

    return (
      <div className={styles.wrapper}>
        <Form data={this.formTemplate} ref={formRef}>
          {this.renderName()}
          {this.renderTypeSelect()}
          {this.renderSelectorLabels()}
          {this.renderPorts()}
        </Form>
      </div>
    )
  }
}
