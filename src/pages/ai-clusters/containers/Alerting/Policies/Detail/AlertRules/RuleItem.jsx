import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'

import { ALL_METRICS_CONFIG } from 'configs/alerting/metrics'
import { Icon } from '@kube-design/components'
import { Text } from 'components/Base'

import styles from './index.scss'

export default class RuleItem extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    resources: PropTypes.array,
  }

  static defaultProps = {
    data: {},
    resources: [],
  }

  render() {
    const { kind, data = {}, resources = [] } = this.props
    const { condition_type, thresholds, unit, _metricType } = data
    const target = `${t(kind)}: ${resources.join(', ')}`
    const metricConfig = get(ALL_METRICS_CONFIG, _metricType) || {}
    const condtion = ` ${condition_type} ${thresholds}${unit}`

    return (
      <div className={styles.item}>
        <Text title={target} description={t('Monitoring Target')} />
        <Text
          title={
            <span>
              <Icon name={metricConfig.prefixIcon || 'appcenter'} size={20} />
              {t(metricConfig.label || 'Unknown')}
              {condtion}
            </span>
          }
          description={t('Alerting Rule')}
        />
      </div>
    )
  }
}
