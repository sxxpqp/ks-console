import React, { Component } from 'react'
import { get, isEmpty } from 'lodash'

import styles from './index.scss'

export default class Tables extends Component {
  render() {
    const tables = get(this.props.detail, 'tables', [])

    if (isEmpty(tables)) {
      return null
    }

    return tables.map(table => {
      return (
        <div key={table.id} className={styles.info}>
          <div>{table.label}</div>
          {table.rows.map(item => (
            <dl key={item.id}>
              <dt>{item.entries.label}</dt>
              <dd>{item.entries.value}</dd>
            </dl>
          ))}
        </div>
      )
    })
  }
}
