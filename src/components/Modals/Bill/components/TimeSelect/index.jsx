import React from 'react'

import { DatePicker, Select, Notify } from '@kube-design/components'
import { getTimeOptions } from 'components/Cards/Monitoring/Controller/TimeSelector/utils'
import cookie from 'utils/cookie'

import moment from 'moment-mini'
import styles from './index.scss'

const TimeOps = ['1h', '2h', '4h', '8h', '1d']

const format = cookie('lang') === 'zh' ? 'Y年Md日 H:i' : 'M d, Y H:i'

export default class TimeSelect extends React.Component {
  constructor(props) {
    super(props)

    const { timeRange } = this.props
    const end = timeRange.end || new Date()

    this.endMaxDate = new Date(end)
    this.maxDate = new Date(moment(end).subtract(1, 'minutes'))
    this.minDate = new Date(timeRange.start)
  }

  getTimeRange = ({ type, methord }) => selectedDates => {
    const { getTime, timeRange } = this.props
    const { end, start } = timeRange
    const time = new Date(selectedDates[0]).getTime()

    if (
      (type === 'start' && time >= end) ||
      (type === 'end' && time <= start)
    ) {
      return
    }

    getTime({ type, value: time, methord })
  }

  handleStepChange = ({ type, methord }) => value => {
    const _step = value
    const { getTime, timeRange } = this.props
    const { end, start } = timeRange

    const day = Math.floor((end - start) / 3600 / 24 / 1000)

    if (day >= 30 && _step !== '1d') {
      Notify.error({ content: t('TIMERANGE_MORE_30DAY_MSG') })
      return
    }

    getTime({ type, value: _step, methord })
  }

  handleTimeRangeChange = type => selectedDates => {
    const { getTime, timeRange } = this.props
    const { end, start, step } = timeRange
    const time = new Date(selectedDates[0]).getTime()

    if (
      (type === 'start' && time >= end) ||
      (type === 'end' && time <= start)
    ) {
      Notify.error({ content: t('TIMERANGE_SELECTOR_MSG') })
      return
    }

    if (type === 'start') {
      const day = Math.floor((end - time) / 3600 / 24 / 1000)
      if (day >= 30 && step !== '1d') {
        getTime({ type: 'step', value: '1d', methord: 'change' })
      }
    }

    if (type === 'end') {
      const day = Math.floor((time - start) / 3600 / 24 / 1000)
      if (day >= 30 && step !== '1d') {
        getTime({ type: 'step', value: '1d', methord: 'change' })
      }
    }
    getTime({ type, value: time, methord: 'change' })
  }

  render() {
    const { timeRange } = this.props
    const { step, start, end } = timeRange

    return (
      <ul className={styles.datepicker}>
        <li>
          <div>{t('Reconciliation Cycle')}</div>
        </li>
        <li>
          <DatePicker
            defaultValue={start}
            value={start}
            showClearBtn={false}
            dateFormat={format}
            minDate={this.minDate}
            maxDate={this.maxDate}
            onClose={this.getTimeRange({
              type: 'start',
              methord: 'close',
            })}
            onChange={this.handleTimeRangeChange('start')}
          />
          <p>{t('Start Time')}</p>
        </li>
        <li>
          <DatePicker
            defaultValue={end}
            value={end}
            showClearBtn={false}
            dateFormat={format}
            minDate={this.minDate}
            maxDate={this.endMaxDate}
            onClose={this.getTimeRange({
              type: 'end',
              methord: 'close',
            })}
            onChange={this.handleTimeRangeChange('end')}
          />
          <p>{t('End Time')}</p>
        </li>
        <li>
          <div>
            <Select
              value={step}
              options={getTimeOptions(TimeOps)}
              onChange={this.handleStepChange({
                type: 'step',
                methord: 'close',
              })}
            />
          </div>
          <p>{t('Time Interval')}</p>
        </li>
      </ul>
    )
  }
}
