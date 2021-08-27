import React from 'react'
import { isEmpty } from 'lodash'

import CanvasGraph from './CanvasGraph'
import TimeRange from './TimeRange'

import styles from './index.scss'

export default class SpanGraph extends React.Component {
  render() {
    const { data, viewRange, onRangeChange } = this.props

    if (isEmpty(data)) {
      return null
    }

    return (
      <div className={styles.graph}>
        <CanvasGraph data={data} />
        <TimeRange
          data={data}
          viewRange={viewRange}
          onRangeChange={onRangeChange}
        />
      </div>
    )
  }
}
