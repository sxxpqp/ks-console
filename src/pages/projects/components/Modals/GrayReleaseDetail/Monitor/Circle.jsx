import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import { Icon, Tooltip } from '@kube-design/components'
import { PieChart } from 'components/Charts'
import { getSuitableValue } from 'utils/monitoring'

import styles from './index.scss'

export default class CircleChart extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    unit: PropTypes.string,
    data: PropTypes.array,
    legendData: PropTypes.array,
    whiteMode: PropTypes.bool,
  }

  static defaultProps = {
    title: '',
    data: [],
    legendData: [],
    whiteMode: false,
  }

  getSeriesData = () => {
    const { data, legendData, whiteMode } = this.props

    const data0 = data[0]
      ? get(data[0], `[${data[0].length - 1}].[1]`, NaN)
      : NaN
    const data1 = data[1]
      ? get(data[1], `[${data[1].length - 1}].[1]`, NaN)
      : NaN

    return [
      {
        name: legendData[0],
        itemStyle: {
          fill: whiteMode ? '#ffffff' : '#329dce',
        },
        value: Number(data0),
      },
      {
        name: legendData[1],
        itemStyle: {
          fill: whiteMode ? '#6fbadc' : '#c7deef',
        },
        value: Number(data1),
      },
    ]
  }

  renderTip() {
    const { tip, whiteMode } = this.props

    return (
      <Tooltip content={tip}>
        <Icon
          name="information"
          className={styles.tip}
          type={whiteMode ? 'light' : 'dark'}
        />
      </Tooltip>
    )
  }

  render() {
    const { title, tip, data, unit } = this.props

    const data0 = data[0]
      ? get(data[0], `[${data[0].length - 1}].[1]`, NaN)
      : NaN
    const data1 = data[1]
      ? get(data[1], `[${data[1].length - 1}].[1]`, NaN)
      : NaN

    return (
      <div className={styles.chart}>
        <div className={styles.circle}>
          <PieChart width={40} height={40} data={this.getSeriesData()} />
        </div>
        <div className={styles.chartDetail}>
          <div className={styles.title}>
            {title} {tip && this.renderTip()}
          </div>
          <div>
            <span className={styles.tag}>
              {isNaN(data0)
                ? t('No Data')
                : `${getSuitableValue(data0, unit)} ${unit}`}
            </span>
            <span className={styles.tag}>
              {isNaN(data1)
                ? t('No Data')
                : `${getSuitableValue(data1, unit)} ${unit}`}
            </span>
          </div>
        </div>
      </div>
    )
  }
}
