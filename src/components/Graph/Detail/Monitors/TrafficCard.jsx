import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from '@kube-design/components'

import styles from './index.scss'

export default class TrafficCard extends React.Component {
  static propTypes = {
    metrics: PropTypes.array,
  }

  static defaultProps = {
    metrics: [],
  }

  render() {
    const { metrics } = this.props
    return (
      <div className={styles.trafficCard}>
        {metrics.map(metric => (
          <div key={metric.title}>
            <div className="h5">
              {isNaN(metric.data)
                ? t('No Data')
                : `${metric.data} ${metric.unit}`}
            </div>
            <p>
              <Icon name={metric.icon} />
              {t(metric.title)}
            </p>
          </div>
        ))}
      </div>
    )
  }
}
