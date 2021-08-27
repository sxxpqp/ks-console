import React, { Component } from 'react'
import { get, isEmpty } from 'lodash'

import Table from '../Table'

export default class Connections extends Component {
  getColumns(con) {
    const { jumpTo } = this.props
    return [
      {
        id: 'label',
        label: con.label,
        defaultSort: false,
        render: (label, record) => (
          <a onClick={() => jumpTo(record)}>{label}</a>
        ),
      },
      ...con.columns,
    ]
  }

  getData(con) {
    return con.connections.map(item => ({
      id: item.nodeId,
      label: { value: item.label },
      ...item.metadata.reduce(
        (prev, cur) => ({
          ...prev,
          [cur.id]: this.format(cur),
        }),
        {}
      ),
    }))
  }

  format = data => {
    if (
      data.dataType === 'number' ||
      data.id === 'count' ||
      data.id === 'port'
    ) {
      data.value = Number(data.value)
    }

    return data
  }

  render() {
    const connections = get(this.props.detail, 'connections', [])

    if (isEmpty(connections)) {
      return null
    }

    return connections.map(con => (
      <Table
        key={con.id}
        columns={this.getColumns(con)}
        data={this.getData(con)}
      />
    ))
  }
}
