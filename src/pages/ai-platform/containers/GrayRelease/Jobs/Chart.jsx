import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Tooltip } from '@kube-design/components'
import { PieChart } from 'components/Charts'

import styles from './index.scss'

export default class Chart extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    tip: PropTypes.string,
    unit: PropTypes.string,
    data: PropTypes.array,
    legendData: PropTypes.array,
  }

  static defaultProps = {
    name: '',
    data: [],
    legendData: [],
  }

  getSeriesData = () => {
    const { data, legendData } = this.props

    return [
      {
        name: legendData[0],
        itemStyle: {
          fill: '#329dce',
        },
        value: data[0] || 0,
      },
      {
        name: legendData[1],
        itemStyle: {
          fill: '#c7deef',
        },
        value: data[1] || 0,
      },
    ]
  }

  renderTip() {
    const { tip } = this.props

    return (
      <Tooltip content={tip}>
        <Icon name="information" className={styles.tip} />
      </Tooltip>
    )
  }

  render() {
    const { name, icon, data, unit, tip } = this.props
    return (
      <div className={styles.chart}>
        <div className={styles.circle}>
          <Icon name={icon} size={20} />
          <PieChart width={60} height={60} data={this.getSeriesData()} />
        </div>
        <div className={styles.chartDetail}>
          <div>
            {name} {tip && this.renderTip()}
          </div>
          <p className={styles.tag}>
            {isNaN(data[0]) ? t('No Data') : `${data[0]} ${unit}`}
          </p>
          <p className={styles.tag}>
            {isNaN(data[1]) ? t('No Data') : `${data[1]} ${unit}`}
          </p>
        </div>
      </div>
    )
  }
}
