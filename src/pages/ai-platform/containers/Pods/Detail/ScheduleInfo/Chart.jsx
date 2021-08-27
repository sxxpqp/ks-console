import React from 'react'

import { Icon } from '@kube-design/components'

import PieChart from 'components/Charts/Pie/PieChart'

import styles from './index.scss'

export default class Chart extends React.Component {
  render() {
    const { metrics = [], icon, unit } = this.props
    const podRequests =
      metrics.find(metric => metric.name === 'podRequests') || {}
    const used = metrics.find(metric => metric.name === 'used') || {}
    return (
      <div className={styles.chart}>
        <Icon name={icon} size={32} />
        <div className={styles.chartWrapper}>
          <PieChart width={92} height={92} data={metrics} />
        </div>
        <div className={styles.text}>
          <div>
            <span>
              {used.value} {unit}
            </span>
            <span className={styles.podRequests}>+ {podRequests.value}</span>
          </div>
          <p>{t('节点已用请求')}</p>
        </div>
      </div>
    )
  }
}
