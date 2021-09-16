import React from 'react'

import { Form } from '@kube-design/components'
import ClusterSelect from './ClusterSelect'

import styles from './index.scss'

export default class BaseInfo extends React.Component {
  render() {
    const { formRef, formTemplate } = this.props

    return (
      <div className={styles.wrapper}>
        <div className={styles.step}>
          <div>{t('Select Clusters')}</div>
          <p>{t('SELECT_CLUSTERS_DESC')}</p>
        </div>
        <Form data={formTemplate} ref={formRef}>
          <Form.Item label={t('Available Clusters')}>
            <ClusterSelect name="spec.placement.clusters" />
          </Form.Item>
        </Form>
      </div>
    )
  }
}
