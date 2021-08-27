import React, { Component } from 'react'
import { Form, Select } from '@kube-design/components'

import styles from './index.scss'

class LogCollectionStatusForm extends Component {
  statusLabel = [
    {
      label: t('Activate'),
      value: 1,
    },
    {
      label: t('Close'),
      value: 0,
    },
  ]

  render() {
    return (
      <div>
        <p className={styles.tip}>{t('LOG_COLLECTION_ENABLE_TIPS')}</p>
        <Form.Item>
          <Select name="enabled" options={this.statusLabel} />
        </Form.Item>
      </div>
    )
  }
}

export default LogCollectionStatusForm
