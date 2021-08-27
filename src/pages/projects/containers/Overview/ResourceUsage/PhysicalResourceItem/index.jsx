import React from 'react'

import { getLocalTime } from 'utils'
import { getAreaChartOps } from 'utils/monitoring'

import SimpleArea from '../SimpleArea'

import styles from './index.scss'

export default class PhysicalResourceItem extends React.Component {
  render() {
    const { type, title, metrics, showDay } = this.props
    const config = getAreaChartOps({
      title,
      unitType: type,
      legend: ['Count'],
      data: metrics,
      xFormatter: value =>
        getLocalTime(Number(value) * 1000).format(
          showDay ? t('Do HH:mm') : 'HH:mm'
        ),
    })

    return (
      <div className={styles.wrapper}>
        <div className={styles.chartWrapper}>
          <div className={styles.title}>{title}</div>
          <div className={styles.chart}>
            <SimpleArea
              width="100%"
              height={120}
              bgColor="transparent"
              {...config}
            />
          </div>
        </div>
      </div>
    )
  }
}
