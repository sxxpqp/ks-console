import React from 'react'
import PropTypes from 'prop-types'

import { getAreaChartOps } from 'utils/monitoring'

import { SimpleArea } from 'components/Charts'

import styles from './index.scss'

export default class LineChart extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    unit: PropTypes.string,
    data: PropTypes.array,
    legendData: PropTypes.array,
  }

  static defaultProps = {
    title: '',
    data: [],
    legendData: [],
  }

  render() {
    const { data, legendData, ...rest } = this.props
    const params = {
      width: '100%',
      legend: legendData,
      data: data.map(item => ({
        values: item,
      })),
      areaColors: ['#329dce', '#c7deef'],
      ...rest,
    }

    return (
      <div className={styles.chart}>
        <SimpleArea {...getAreaChartOps(params)} />
      </div>
    )
  }
}
