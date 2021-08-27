import React, { Component } from 'react'
import Item from './Item'

import styles from './index.scss'

export default class Cascader extends Component {
  static defaultProps = {
    level: 0,
    options: [],
    onSelect() {},
  }

  state = {
    openKey: '',
  }

  handleClick = value => {
    this.setState({ openKey: value })
  }

  render() {
    const { openKey } = this.state
    const { style, options, level, onSelect } = this.props
    return (
      <div className={styles.options} style={style}>
        {options.map(item => (
          <Item
            key={item.value}
            data={item}
            level={level}
            isOpen={item.value === openKey}
            onClick={this.handleClick}
            onSelect={onSelect}
          />
        ))}
      </div>
    )
  }
}
