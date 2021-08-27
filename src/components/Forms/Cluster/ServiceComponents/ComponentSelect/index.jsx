import React, { Component } from 'react'

import Item from './Item'

export default class ComponentSelect extends Component {
  render() {
    const { value, components, onChange } = this.props
    return (
      <div>
        {components.map(component => (
          <Item
            data={component}
            key={component.name}
            value={value}
            onChange={onChange}
          />
        ))}
      </div>
    )
  }
}
