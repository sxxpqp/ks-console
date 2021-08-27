import React from 'react'
import { observer, inject } from 'mobx-react'
import Graph from '../components/Graph/ComposeWithLegends'

@inject('monitoringStore')
@observer
export default class GraphMonitorOverview extends React.Component {
  render() {
    const { from, to } = this.props.monitoringStore.getTimeRange()

    const timeRange = {
      start: from.valueOf(),
      end: to.valueOf(),
    }

    const { config, valueFormatter, graphData, legends } = this.props.monitor
    const { title, lines, bars, stack } = config

    return (
      <Graph
        key={legends.map(legend => legend.ID).join(',')}
        title={title}
        line={lines}
        bar={bars}
        stacked={stack}
        timeRange={timeRange}
        valueFormatter={valueFormatter}
        legends={legends}
        data={graphData}
      />
    )
  }
}
