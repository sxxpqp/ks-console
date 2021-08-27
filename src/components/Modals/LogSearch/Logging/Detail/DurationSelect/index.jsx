import React from 'react'
import { observer } from 'mobx-react'
import { computed, action, observable } from 'mobx'
import classnames from 'classnames'
import moment from 'moment-mini'

import { Icon } from '@kube-design/components'
import CustomRange from 'components/Cards/Monitoring/Controller/TimeSelector/Range/Custom'
import RecentTimeSelect from 'components/Cards/Monitoring/Controller/TimeSelector/Range/Default'
import { getTimeLabel } from 'components/Cards/Monitoring/Controller/TimeSelector/utils'

import styles from './index.scss'

@observer
export default class DurationSelect extends React.Component {
  @observable
  showDropDown = false

  @observable
  step = '1m'

  @observable
  times = 1

  @observable
  lastTime = ''

  @computed
  get duration() {
    if (this.lastTime) {
      return `${t('Last')} ${getTimeLabel(this.lastTime)}`
    }
    const { startTime, endTime } = this.props.duration
    return `${moment(startTime).format('YYYY-MM-DD HH:mm:ss')} 
    ~ ${moment(endTime).format('YYYY-MM-DD HH:mm:ss')}`
  }

  @action
  handleTimeChange = ({ end, lastTime, start, step, times }) => {
    this.step = step
    this.times = times
    this.lastTime = lastTime

    const { duration } = this.props
    duration.startTime = start * 1000
    duration.endTime = end * 1000
    this.hiddenDropdown()
    this.props.onChange()
  }

  @action
  changeLastTime = ({ step, times, lastTime }) => {
    this.step = step
    this.times = times
    this.lastTime = lastTime

    const { duration } = this.props
    const now = Date.now()
    duration.endTime = now
    const [, count = 0] = step.match(/(\d+)(m)$/)
    duration.startTime = now - count * times * 60 * 1000

    this.hiddenDropdown()
    this.props.onChange()
  }

  @action
  toggleDropdown = () => {
    this.showDropDown = !this.showDropDown
  }

  hiddenDropdown = () => {
    this.showDropDown = false
  }

  render() {
    return (
      <div>
        <div
          className={classnames(styles.select, this.props.className)}
          onClick={this.toggleDropdown}
        >
          <Icon name="timed-task" type="light" />
          <div className={styles.duration}>{this.duration}</div>
          <Icon name="caret-down" type="light" />
        </div>
        {this.showDropDown && this.renderDropdown()}
      </div>
    )
  }

  renderDropdown() {
    const { startTime, endTime } = this.props.duration

    return (
      <div className={styles.durationDropdown}>
        <RecentTimeSelect
          step={this.step}
          times={this.times}
          onChange={this.changeLastTime}
        />
        <CustomRange
          start={startTime}
          end={endTime}
          showStep={false}
          onSubmit={this.handleTimeChange}
          onCancel={this.hiddenDropdown}
        />
      </div>
    )
  }
}
