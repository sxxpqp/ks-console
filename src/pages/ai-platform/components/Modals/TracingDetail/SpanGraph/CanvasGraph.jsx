import React from 'react'
import { renderIntoCanvas } from 'utils/tracing'

export default class CanvasGraph extends React.Component {
  constructor(props) {
    super(props)

    this.canvas = React.createRef()
  }

  componentDidMount() {
    this.drawCanvas()
  }

  getColor = name => this.props.data.serviceColorMap[name]

  drawCanvas() {
    if (this.canvas && this.canvas.current) {
      const { data } = this.props
      const items = data.spans.map(span => ({
        valueOffset: span.relativeStartTime,
        valueWidth: span.duration,
        serviceName: span.process.serviceName,
      }))

      renderIntoCanvas(this.canvas.current, items, data.duration, this.getColor)
    }
  }

  render() {
    return <canvas ref={this.canvas} />
  }
}
