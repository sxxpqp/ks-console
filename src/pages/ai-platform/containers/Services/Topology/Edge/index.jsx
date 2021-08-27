import React, { Component } from 'react'
import { line, curveBasis } from 'd3-shape'

import styles from './index.scss'

export default class index extends Component {
  render() {
    const { data = {} } = this.props

    const spline = line()
      .curve(curveBasis)
      .x(d => d.x)
      .y(d => d.y)

    const id = data.v + data.w

    return (
      <g className={styles.wrapper}>
        <defs>
          <marker
            id={`triangle-${id}`}
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
        </defs>
        <path d={spline(data.points)} markerEnd={`url(#triangle-${id})`} />
      </g>
    )
  }
}
