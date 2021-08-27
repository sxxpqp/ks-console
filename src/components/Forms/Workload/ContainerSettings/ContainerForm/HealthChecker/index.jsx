import React from 'react'
import { Form } from '@kube-design/components'

import ProbeInput from '../ProbeInput'

import styles from './index.scss'

export default class HealthChecker extends React.Component {
  static defaultProps = {
    prefix: '',
  }

  get prefix() {
    const { prefix } = this.props

    return prefix ? `${prefix}.` : ''
  }

  render() {
    return (
      <Form.Group
        label={t('Health Checker')}
        desc={t(
          'The health of the container will be checked regularly according to user needs.'
        )}
        checkable
      >
        <Form.Item
          className={styles.item}
          label={t('Container Liveness Check')}
        >
          <ProbeInput
            name={`${this.prefix}livenessProbe`}
            type={t('Container Liveness Check')}
            description={t('LIVENESS_PROBE_DESC')}
            probType="livenessProbe"
          />
        </Form.Item>
        <Form.Item
          className={styles.item}
          label={t('Container Readiness Check')}
        >
          <ProbeInput
            name={`${this.prefix}readinessProbe`}
            type={t('Container Readiness Check')}
            description={t('READINESS_PROBE_DESC')}
            probType="readinessProbe"
          />
        </Form.Item>
        <Form.Item
          className={styles.item}
          label={t('Container Startup Check')}
          tip={t('STARTUP_PROBE_TIP')}
        >
          <ProbeInput
            name={`${this.prefix}startupProbe`}
            type={t('Container Startup Check')}
            description={t('STARTUP_PROBE_DESC')}
            probType="startupProbe"
          />
        </Form.Item>
      </Form.Group>
    )
  }
}
