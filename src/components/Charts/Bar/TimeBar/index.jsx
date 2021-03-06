import React, { Component } from 'react'
import moment from 'moment-mini'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { ResponsiveContainer, BarChart, XAxis, Tooltip, Bar } from 'recharts'
import { timestampify } from 'utils/monitoring'

import styles from './index.scss'

class TimeBar extends Component {
  static propTypes = {
    title: PropTypes.string,
    xKey: PropTypes.string,
    onBarClick: PropTypes.func,
    tooltipCursor: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    data: PropTypes.array.isRequired,
    interval: PropTypes.string.isRequired,
    legend: PropTypes.arrayOf(PropTypes.array),
  }

  static defaultProps = {
    tooltipCursor: false,
    onBarClick() {},
  }

  xTickFormatter = time => {
    const map = {
      s: 'HH:mm:ss',
      m: 'HH:mm',
      h: 'HH:mm',
      d: 'MM/DD',
      M: 'YYYY/MM',
      Y: 'YYYY',
    }
    const [, unit = 's'] = this.props.interval.match(/\d+(\w+)/) || []
    const timestamp = parseInt(time, 10)
    return moment(timestamp).format(map[unit])
  }

  labelFormatter = timestamp => {
    const startTime = timestamp
    const endTime = startTime + timestampify(this.props.interval)
    const startMoment = moment(startTime)
    const endMoment = moment(endTime)
    const isSameDay = startMoment.isSame(endMoment, 'day')
    const dayFormat = 'YYYY/MM/DD'
    const timeFormat = 'HH:mm:ss'
    const momentForMat = `${dayFormat} ${timeFormat}`
    const startMomentString = startMoment.format(momentForMat)
    const endMomentString = endMoment.format(momentForMat)
    const range = isSameDay
      ? `${startMomentString} ~ ${endMoment.format(timeFormat)}`
      : `${startMomentString} ~ ${endMomentString}`

    return `${t('Time Range')} : ${range}`
  }

  render() {
    const { title, className, data, xKey, tooltipCursor } = this.props
    return (
      <div className={classnames(styles.wrapper, className)}>
        {title}
        <ResponsiveContainer width="100%" height="100%" debounce={1}>
          <BarChart data={data}>
            <XAxis
              dataKey={xKey}
              tickFormatter={this.xTickFormatter}
              tickLine={false}
            />
            <Tooltip
              cursor={tooltipCursor}
              labelFormatter={this.labelFormatter}
            />
            {this.renderBars()}
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  renderBars() {
    const { legend, onBarClick } = this.props
    return legend.map(([key, i18n]) => (
      <Bar
        key={key}
        dataKey={key}
        onClick={onBarClick}
        name={i18n}
        maxBarSize={40}
      />
    ))
  }
}

export default TimeBar
