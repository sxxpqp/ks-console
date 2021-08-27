import React from 'react'
import { Form } from '@kube-design/components'

import { UrlInput } from 'components/Inputs'

import styles from './index.scss'

export default class BaseInfo extends React.Component {
  render() {
    return (
      <div className={styles.fromGroup}>
        <Form.Item
          label={t('Service Address')}
          desc={t('LOG_COLLECTION_FLUENTD_URL_TIPS')}
        >
          <UrlInput hostName={'host'} portName={'port'} defaultPort={24224} />
        </Form.Item>
      </div>
    )
  }
}
