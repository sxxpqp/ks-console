import React from 'react'
import { get, isEmpty } from 'lodash'
import { Form, RadioGroup, RadioButton } from '@kube-design/components'

import MonitoringTarget from './MonitoringTarget'
import RuleInput from './RuleInput'
import CustomRule from './CustomRule'
import QueryMonitor from './QueryMonitor'

import styles from './index.scss'

export default class AlertingRule extends React.Component {
  state = {
    query: get(this.props.formTemplate, 'query'),
    ruleType: get(this.props.formTemplate, 'ruleType', 'template'),
  }

  get namespace() {
    return get(this.props.formTemplate, 'namespace')
  }

  get resourceType() {
    return this.namespace ? 'workload' : 'node'
  }

  handleTypeChange = ruleType => {
    this.setState({ ruleType }, () => {
      this.props.formTemplate.ruleType = ruleType
    })
  }

  handleQueryChange = query => {
    this.setState({ query })
  }

  ruleValidator = (rule, value, callback) => {
    if (!value) {
      return callback()
    }

    if (isEmpty(value.thresholds)) {
      return callback({
        message: t('Please add at least one rule'),
        field: rule.field,
      })
    }

    callback()
  }

  renderTemplates() {
    const { cluster, formTemplate } = this.props
    return (
      <div>
        <MonitoringTarget
          namespace={this.namespace}
          cluster={cluster}
          formTemplate={formTemplate}
        />
        <Form.Item
          label={t('Alerting Rules')}
          rules={[
            { required: true, message: t('Please add at least one rule') },
            { validator: this.ruleValidator },
          ]}
        >
          <RuleInput name="rules[0]" resourceType={this.resourceType} />
        </Form.Item>
      </div>
    )
  }

  renderCustomRule() {
    const { cluster, namespace, store, formTemplate } = this.props
    return (
      <>
        <Form.Item
          label={t('Rule Expression')}
          desc={t.html('ALERT_RULE_EXPRESSION_DESC')}
          rules={[
            { required: true, message: t('Please input the rule expression') },
          ]}
        >
          <CustomRule
            name="query"
            store={store}
            cluster={cluster}
            namespace={namespace}
            onChange={this.handleQueryChange}
          />
        </Form.Item>
        <div className="margin-t12">
          <QueryMonitor
            query={this.state.query}
            duration={formTemplate.duration}
            store={store}
            cluster={cluster}
            namespace={namespace}
          />
        </div>
      </>
    )
  }

  render() {
    const { ruleType } = this.state
    const { formRef, formTemplate } = this.props

    return (
      <Form data={formTemplate} ref={formRef}>
        <RadioGroup
          mode="button"
          buttonWidth={155}
          value={ruleType}
          onChange={this.handleTypeChange}
        >
          <RadioButton value="template">{t('Rule Templates')}</RadioButton>
          <RadioButton value="custom">{t('Custom Rule')}</RadioButton>
        </RadioGroup>
        <div className={styles.content}>
          <div className={styles.contentWrapper}>
            {ruleType === 'template'
              ? this.renderTemplates()
              : this.renderCustomRule()}
          </div>
        </div>
      </Form>
    )
  }
}
