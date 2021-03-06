import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { omit } from 'lodash'

import { Button, Icon } from '@kube-design/components'

import DefaultRange from './Range/Default'
import CustomRange from './Range/Custom'

import { getLastTimeStr, getTimeLabel, getDateStr } from './utils'
import styles from './index.scss'

export default class TimeSelector extends React.PureComponent {
  static propTypes = {
    step: PropTypes.string,
    times: PropTypes.number,
    onChange: PropTypes.func,
    onToggle: PropTypes.func,
  }

  static defaultProps = {
    step: '10m',
    times: 30,
    onChange() {},
    onToggle() {},
  }

  constructor(props) {
    super(props)

    const { step, times } = props

    this.state = {
      visible: false,
      prevPropStep: step,
      step,
      prevPropTimes: times,
      times,
      start: '',
      end: '',
      lastTime: '',
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.step !== prevState.prevPropStep ||
      nextProps.times !== prevState.prevPropTimes
    ) {
      const { step, times } = nextProps
      return {
        prevPropStep: step,
        step,
        prevPropTimes: times,
        times,
      }
    }
    return null
  }

  handleToggle = () => {
    this.setState({ visible: !this.state.visible }, () => {
      this.props.onToggle(this.state.visible)
    })
  }

  hideSelector = () => {
    this.setState({ visible: false }, () => {
      this.props.onToggle(false)
    })
  }

  handleTimeChange = data => {
    this.setState({ visible: false, ...data }, () => {
      const newData = omit(data, ['lastTime'])

      this.props.onChange(newData)
    })
  }

  renderButtonText() {
    const { step, times, start, end, lastTime } = this.state
    const { showStep = true } = this.props

    if (start && end && !lastTime) {
      const intervalText = `(${t('Interval')} ${getTimeLabel(step)})`
      return `${getDateStr(start)} ~ ${getDateStr(end)} ${
        showStep ? intervalText : ''
      }`
    }

    const lastTimeText = getTimeLabel(lastTime || getLastTimeStr(step, times))
    return `${t('Last')} ${lastTimeText}`
  }

  renderContent() {
    const { step, times } = this.state
    const { showStep = true } = this.props
    return (
      <div className={styles.content}>
        <DefaultRange
          step={step}
          times={times}
          onChange={this.handleTimeChange}
        />
        <CustomRange
          step={step}
          times={times}
          showStep={showStep}
          onSubmit={this.handleTimeChange}
          onCancel={this.hideSelector}
        />
      </div>
    )
  }

  render() {
    const { className, dark, arrowIcon } = this.props
    return (
      <div
        className={classnames(styles.selector, className, {
          [styles.active]: this.state.visible,
        })}
      >
        <div
          className={classnames(styles.mask, {
            [styles.active]: this.state.visible,
          })}
          onClick={this.hideSelector}
        />
        <Button className={styles.button} onClick={this.handleToggle}>
          <Icon type={dark ? 'dark' : 'light'} name="timed-task" size={20} />
          <p>{this.renderButtonText()}</p>
          <Icon
            className={styles.arrow}
            type={dark ? 'dark' : 'light'}
            name={arrowIcon || 'caret-down'}
          />
        </Button>
        <div className={styles.dropdown}>{this.renderContent()}</div>
      </div>
    )
  }
}
