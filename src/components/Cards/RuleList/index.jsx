import React from 'react'

import styles from './index.scss'

export default class RuleList extends React.Component {
  render() {
    const { templates } = this.props

    return (
      <ul className={styles.wrapper} data-test="rule-list">
        {Object.keys(templates).map(key => (
          <li key={key}>
            <span className={styles.name}>{t(key)}</span>
            <span>
              {templates[key].map(role => t(role.aliasName)).join(' / ')}
            </span>
          </li>
        ))}
      </ul>
    )
  }
}
