import React from 'react'

import { Form, Input } from '@kube-design/components'
import { UrlInput } from 'components/Inputs'

import styles from './index.scss'

export default class BaseInfo extends React.Component {
  render() {
    return (
      <div className={styles.fromGroup}>
        <Form.Item
          label={t('Service Address')}
          desc={t('LOG_COLLECTION_ES_URL_TIPS')}
        >
          <UrlInput hostName={'host'} portName={'port'} />
        </Form.Item>
        <Form.Item
          label={t('Index Prefix')}
          desc={t('LOG_COLLECTION_ES_INDEX_TIPS')}
          rules={[{ required: true, message: t('Please input value') }]}
        >
          <Input name="logstashPrefix" defaultValue="ks-logstash-log" />
        </Form.Item>
      </div>
    )
  }
}
