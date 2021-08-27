import React from 'react'
import { get, isEmpty, set } from 'lodash'

import { Form, Input, TextArea } from '@kube-design/components'

import { ALL_METRICS_CONFIG } from 'configs/alerting/metrics'

import styles from './index.scss'

export default class NotificationRule extends React.Component {
  constructor(props) {
    super(props)

    const { formTemplate } = this.props
    const { kind = 'Node', resources, rules } = formTemplate
    if (!isEmpty(resources) && !isEmpty(rules)) {
      const summary = `${t(kind)} ${resources.join(', ')} ${rules
        .map(item => {
          const { _metricType, condition_type, thresholds, unit } = item || {}
          const metricConfig = get(ALL_METRICS_CONFIG, _metricType) || {}
          return `${t(
            metricConfig.label
          )} ${condition_type} ${thresholds}${unit}`
        })
        .join(` ${t('or')} `)}`

      set(formTemplate, 'annotations.summary', summary)
    }
  }

  render() {
    const { formRef, formTemplate } = this.props

    return (
      <Form className={styles.wrapper} data={formTemplate} ref={formRef}>
        <div className={styles.title}>{t('Notification Content')}</div>
        <div className={styles.content}>
          <div className={styles.contentWrapper}>
            <Form.Item label={t('Summary')}>
              <Input name="annotations.summary" maxLength={253} />
            </Form.Item>
            <Form.Item label={t('Message')}>
              <TextArea name="annotations.message" rows={8} />
            </Form.Item>
          </div>
        </div>
      </Form>
    )
  }
}
