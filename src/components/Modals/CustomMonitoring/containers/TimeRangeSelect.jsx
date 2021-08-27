import React from 'react'
import { observer, inject } from 'mobx-react'
import moment from 'moment-mini'

import { translateTimeAlias, getMsFromTimeAlias } from 'utils/time'

import TimeRangeSelect from '../components/TimeRangeSelect'
import { recentTimeRange } from '../options'

const FULL_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

const getISOStringFromDate = function(timestamp) {
  return new Date(timestamp).toISOString()
}

@inject('monitoringStore')
@observer
class CustomMonitorTimeRangeSelect extends React.Component {
  handleQuickSelect = time => {
    this.props.monitoringStore.changeTimeRange(time)
  }

  handeCustomSelect = ({ startTime, endTime }) => {
    this.props.monitoringStore.changeTimeRange({
      from: getISOStringFromDate(startTime),
      to: getISOStringFromDate(endTime),
    })
  }

  options = recentTimeRange.map(recentDuration => ({
    label: `${t('Last')} ${translateTimeAlias(recentDuration)}`,
    value: {
      from: `now-${recentDuration}`,
      to: 'now',
    },
  }))

  format = () => {
    const { to, from } = this.props.monitoringStore.time
    return to === 'now'
      ? `${t('Last')} ${translateTimeAlias(from.replace('now-', ''))}`
      : `${moment(from).format(FULL_TIME_FORMAT)} ~ ${moment(to).format(
          FULL_TIME_FORMAT
        )}`
  }

  generateTimeRange() {
    const { time } = this.props.monitoringStore
    const { from, to } = time
    const isRecent = to === 'now'
    return isRecent
      ? {
          startTime: Date.now() - getMsFromTimeAlias(from.replace('now-', '')),
          endTime: Date.now(),
        }
      : {
          startTime: new Date(from).valueOf(),
          endTime: new Date(to).valueOf(),
        }
  }

  render() {
    const { from, to } = this.props.monitoringStore.time
    return (
      <TimeRangeSelect
        key={from + to}
        recentOpts={this.options}
        timeRange={this.generateTimeRange()}
        onRecentSelect={this.handleQuickSelect}
        onCustomSubmit={this.handeCustomSelect}
        format={this.format}
      />
    )
  }
}

export default CustomMonitorTimeRangeSelect
