import React from 'react'
import PropTypes from 'prop-types'

import { Icon } from '@kube-design/components'

import { Text } from 'components/Base'

import styles from './index.scss'

const STATES = {
  current: 'Setting',
  finished: 'Finished',
  notfinish: 'Not set',
}

const Step = ({ step, state }) => (
  <li className={styles[state]}>
    <div className={styles.icon}>
      <Icon name={step.icon || 'appcenter'} size={40} />
    </div>
    <Text
      className={styles.text}
      title={t(step.title)}
      description={t(STATES[state])}
    />
  </li>
)

export default class Steps extends React.Component {
  static propTypes = {
    steps: PropTypes.array.isRequired,
    current: PropTypes.number.isRequired,
  }

  getState = index => {
    const { current } = this.props
    if (index === current) {
      return 'current'
    }
    if (index < current) {
      return 'finished'
    }

    return 'notfinish'
  }

  render() {
    const { steps } = this.props

    return (
      <div className={styles.steps}>
        <ul>
          {steps.map((step, index) => (
            <Step key={step.title} step={step} state={this.getState(index)} />
          ))}
        </ul>
      </div>
    )
  }
}
