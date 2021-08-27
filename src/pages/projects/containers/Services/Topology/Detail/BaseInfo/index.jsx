import React, { Component } from 'react'
import { get, isEmpty } from 'lodash'
import { getLocalTime } from 'utils'

import styles from './index.scss'

export default class BaseInfo extends Component {
  getValue(item) {
    if (item.type === 'datetime') {
      return getLocalTime(item.value).format(`YYYY-MM-DD HH:mm:ss`)
    }
    return item.value
  }

  render() {
    const metadata = get(this.props.detail, 'metadata', [])

    if (isEmpty(metadata)) {
      return null
    }

    return (
      <div className={styles.info}>
        <div>Info</div>
        {metadata.map(item => (
          <dl key={item.id}>
            <dt>{item.label}</dt>
            <dd>{this.getValue(item)}</dd>
          </dl>
        ))}
      </div>
    )
  }
}
