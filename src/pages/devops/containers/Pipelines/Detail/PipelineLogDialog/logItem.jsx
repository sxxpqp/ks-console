import React from 'react'
import classNames from 'classnames'
import { Icon } from '@kube-design/components'
import { action } from 'mobx'
import { observer } from 'mobx-react'
import Status from 'devops/components/Status'
import { getPipelineStatus } from 'utils/status'
import LogStore from 'stores/devops/log'

import { formatUsedTime } from 'utils'

import styles from './index.scss'

@observer
export default class LogItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isExpand: false,
    }
    this.store = new LogStore()
  }

  componentDidMount() {
    this.timer = setInterval(this.handleRefresh, 4000)
    this.handleExpandByFail()
  }

  componentDidUpdate(prevProps) {
    if (
      this.state.isExpand &&
      prevProps.refreshFlag !== this.props.refreshFlag
    ) {
      this.store.handleResetStepLog()
      this.getLog()
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  handleExpandByFail = () => {
    const step = this.props.step
    if (step && step.result !== 'SUCCESS') {
      this.toggleExpand()
    }
  }

  handleRefresh = () => {
    const { step } = this.props
    const { hasMore } = this.store.stepLogData

    if (this.state.isExpand && (hasMore || step.state !== 'FINISHED')) {
      this.getLog()
    }
  }

  toggleExpand = () => {
    const { log } = this.store.stepLogData
    const { isExpand } = this.state

    if (!isExpand && !log) {
      this.getLog()
    }
    this.setState({ isExpand: !isExpand })
  }

  @action
  getLog() {
    const { step, params, nodeId } = this.props

    this.store.getStepLog({ ...params, nodeId, stepId: step.id })
  }

  render() {
    const { step } = this.props
    const { log } = this.store.stepLogData

    return (
      <div className={styles.LogItem}>
        <div
          className={classNames(styles.LogItem__title)}
          onClick={this.toggleExpand}
        >
          <Icon
            name={this.state.isExpand ? 'caret-down' : 'caret-right'}
            size={16}
          />
          {step.displayName}
          <span className={styles.logitem_status}>
            <span>{formatUsedTime(step.durationInMillis)}</span>
            <Status {...getPipelineStatus(step)} />
          </span>
        </div>
        <div>
          {this.state.isExpand ? (
            <pre className={styles.LogItem_content}>{log}</pre>
          ) : null}
        </div>
      </div>
    )
  }
}
