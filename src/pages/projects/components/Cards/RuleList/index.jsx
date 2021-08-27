import { isString } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'

import styles from './index.scss'

export default class RuleList extends React.Component {
  static propTypes = {
    rules: PropTypes.array,
  }

  static defaultProps = {
    rules: [],
  }

  render() {
    const { rules } = this.props

    return (
      <ul className={styles.rules}>
        {rules.map(rule => (
          <li key={rule.name}>
            <span className={styles.name}>
              {t(`RULE_${rule.name.toUpperCase()}`)}
            </span>
            <span>
              {rule.actions
                .map(action =>
                  t(
                    `RULE_${(isString(action)
                      ? action
                      : action.name || ''
                    ).toUpperCase()}`
                  )
                )
                .join(' / ')}
            </span>
          </li>
        ))}
      </ul>
    )
  }
}
