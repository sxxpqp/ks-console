import React, { Component } from 'react'
import { get, isEmpty } from 'lodash'

import Table from '../Table'

export default class Childrens extends Component {
  getColumns(child) {
    return [
      {
        id: 'label',
        label: child.label,
        defaultSort: false,
        render: label => <strong>{label}</strong>,
      },
      ...child.columns,
    ]
  }

  getData(child) {
    return child.nodes.map(item => ({
      id: item.id,
      label: { value: item.label },
      ...[...(item.metadata || []), ...(item.metrics || [])].reduce(
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
    const children = get(this.props.detail, 'children', [])

    if (isEmpty(children)) {
      return null
    }

    return children.map(child => (
      <Table
        key={child.topologyId}
        columns={this.getColumns(child)}
        data={this.getData(child)}
      />
    ))
  }
}
