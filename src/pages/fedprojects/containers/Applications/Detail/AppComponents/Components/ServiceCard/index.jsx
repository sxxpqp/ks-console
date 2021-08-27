import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { get } from 'lodash'

import { Text } from 'components/Base'

import styles from './index.scss'

export default class ServiceCard extends Component {
  render() {
    const { data, prefix } = this.props
    const serviceType = get(
      data,
      'annotations["kubesphere.io/serviceType"]',
      ''
    )

    return (
      <div className={styles.wrapper}>
        <Text
          icon="appcenter"
          title={
            <Link to={`${prefix}/services/${data.name}`}>{data.name}</Link>
          }
          description={t(`SERVICE_TYPE_${serviceType.toUpperCase()}`)}
        />
        <Text
          title={`${data.name}.${data.namespace}.svc`}
          description={t('EIP_POOL_DESC')}
        />
        <Text title={data.clusterIP} description={t('Virtual IP')} />
      </div>
    )
  }
}
