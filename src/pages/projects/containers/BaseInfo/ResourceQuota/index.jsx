import React from 'react'

import { get } from 'lodash'

import { QUOTAS_MAP } from 'utils/constants'
import { Panel } from 'components/Base'

import QuotaItem from './QuotaItem'

import styles from './index.scss'

export default class ResourceQuota extends React.Component {
  render() {
    const { detail } = this.props
    return (
      <Panel className={styles.wrapper} title={t('Resource Quota')}>
        {Object.entries(QUOTAS_MAP).map(([key, value]) => (
          <QuotaItem
            key={key}
            name={key}
            total={get(detail, `hard["${value.name}"]`)}
            used={get(detail, `used["${value.name}"]`, 0)}
            left={get(detail, `left["${value.name}"]`)}
          />
        ))}
      </Panel>
    )
  }
}
