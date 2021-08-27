import React from 'react'
import { get } from 'lodash'
import moment from 'moment-mini'
import classnames from 'classnames'
import {
  ComposedChart,
  ResponsiveContainer,
  XAxis,
  CartesianGrid,
  YAxis,
  Tooltip,
  Area,
  Bar,
} from 'recharts'

import styles from './index.scss'

const STACKED_SYM = 'A'
const debounce = 100
const defaultTickCount = 5
const tickWidth = 75
const defaultAreaOpacity = 0.4

const generateTimeTick = function({ from, to, count }) {
  const timeDistance = to - from
  const perDist = parseInt(timeDistance / (count + 1), 10)

  return Array(count)
    .fill({})
    .reduce(
      (timeList, noop, index) => timeList.concat(from + perDist * (index + 1)),
      []
    )
}

const timeFormatThreshold = {
  [60 * 1000]: 'mm:ss',
  [60 * 60 * 1000]: 'HH:mm',
  [60 * 60 * 24 * 1000]: 'ddd HH:mm',
  [60 * 60 * 24 * 15 * 1000]: 'MMM Do',
  Infinity: 'MMM YYYY',
}

function labelTimeFormat(time = Date.now()) {
  return moment(time).format('YYYY-MM-DD HH:mm:ss')
}

export default class ComposeCustomChart extends React.PureComponent {
  ref = React.createRef()

  static defaultProps = {
    valueFormatter: value => value,
  }

  getTickCount() {
    const width = get(this.ref, 'current.offsetWidth')
    if (width) {
      return Math.floor(width / tickWidth)
    }
    return defaultTickCount
  }

  getXAxisExpand() {
    const { data, timeRange, bar } = this.props
    const dataLength = data.length
    const timeGap = timeRange.end - timeRange.start
    return dataLength > 1 && bar ? timeGap / (2 * dataLength - 2) : 0
  }

  getTicks(count = 5) {
    const [start, end] = this.getDomain()
    return generateTimeTick({
      from: start,
      to: end,
      count,
    })
  }

  getDomain() {
    const { timeRange } = this.props
    const { start, end } = timeRange
    const expand = this.getXAxisExpand()
    return [start - expand, end + expand]
  }

  getTickFormatter(tickCount) {
    const [start, end] = this.getDomain()
    const distance = end - start
    const perTickGap = distance / tickCount

    for (const maxValue in timeFormatThreshold) {
      if (perTickGap <= Number(maxValue)) {
        const format = timeFormatThreshold[maxValue]
        return function(time) {
          return moment(time).format(format)
        }
      }
    }
  }

  render() {
    const {
      data,
      legends,
      line,
      bar,
      cartesianGrid = true,
      stacked = false,
      yAxis = true,
      className,
      valueFormatter,
    } = this.props

    return (
      <div
        style={{ height: '300px' }}
        className={classnames(styles.wrapper, className)}
        ref={this.ref}
      >
        <ResponsiveContainer debounce={debounce}>
          <ComposedChart data={data}>
            {cartesianGrid && <CartesianGrid vertical={false} />}
            {this.renderTimeXAxis()}
            {yAxis && (
              <YAxis
                tickFormatter={valueFormatter}
                tickLine={null}
                axisLine={null}
              />
            )}
            {bar &&
              legends.map(legend => (
                <Bar
                  isAnimationActive={false}
                  connectNulls
                  key={`${legend.ID} - bar`}
                  name={legend.name}
                  dataKey={legend.ID}
                  fill={legend.color}
                  stroke={legend.color}
                  stackId={stacked ? STACKED_SYM : undefined}
                  fillOpacity={legend.opacity || 1}
                  /*
                   * fix the bug when data length is 1 the bar will hidden
                   */
                  barSize={data.length === 1 ? 20 : undefined}
                />
              ))}

            {line &&
              legends.map(legend => (
                <Area
                  isAnimationActive={false}
                  connectNulls
                  key={`${legend.ID} - area`}
                  name={legend.name}
                  dataKey={legend.ID}
                  fill={legend.color}
                  stroke={legend.color}
                  stackId={stacked ? STACKED_SYM : undefined}
                  fillOpacity={legend.opacity || defaultAreaOpacity}
                />
              ))}
            <Tooltip
              wrapperStyle={{ zIndex: 1000 }}
              formatter={valueFormatter}
              labelFormatter={labelTimeFormat}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    )
  }

  renderTimeXAxis() {
    const { xAxis = true } = this.props
    /**
     * make all bars visble
     */
    const domain = this.getDomain()
    const tickCount = this.getTickCount()
    const ticks = this.getTicks(tickCount)
    const tickFormatter = this.getTickFormatter(tickCount)

    return (
      <XAxis
        hide={!xAxis}
        type="number"
        dataKey="time"
        scale="time"
        interval={0}
        tickLine={null}
        domain={domain}
        ticks={ticks}
        tickFormatter={tickFormatter}
      />
    )
  }
}
