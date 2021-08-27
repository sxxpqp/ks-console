import React, { Component } from 'react'
import { Panel } from 'components/Base'
import { isEmpty } from 'lodash'

import styles from './index.scss'

export default class Annotations extends Component {
  render() {
    const { annotations } = this.props

    if (isEmpty(annotations)) {
      return null
    }

    return (
      <Panel title={t('Annotations')}>
        <ul className={styles.values}>
          {Object.entries(annotations).map(([key, value]) => (
            <li key={key}>
              <span className={styles.title}>{key}</span>
              <span>{String(value)}</span>
            </li>
          ))}
        </ul>
      </Panel>
    )
  }
}
