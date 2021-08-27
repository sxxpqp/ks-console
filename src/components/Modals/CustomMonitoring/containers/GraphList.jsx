import React, { Component } from 'react'
import { observer } from 'mobx-react'
import GraphMonitorOverview from './GraphMonitorOverview'

import ErrorContainer from '../components/ErrorContainer'
import GraphContainer from '../components/Cards/GraphContainer'

const COMPONENT_MAP = {
  graph: GraphMonitorOverview,
  table: () => {
    'table'
  },
}

@observer
export default class GraphList extends Component {
  render() {
    return (
      <div>
        {this.props.rows.map(row => (
          <React.Fragment key={row.config.id}>
            {row.monitors.map(monitor => {
              const { id, title, description, type } = monitor.config || {}
              const View = COMPONENT_MAP[type]
              return (
                <ErrorContainer key={id} errorMessage={monitor.errorMessage}>
                  <GraphContainer title={title} description={description}>
                    {View ? <View monitor={monitor} /> : null}
                  </GraphContainer>
                </ErrorContainer>
              )
            })}
          </React.Fragment>
        ))}
      </div>
    )
  }
}
