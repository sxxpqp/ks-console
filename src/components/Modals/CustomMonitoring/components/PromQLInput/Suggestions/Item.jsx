import React, { Component } from 'react'
import classNames from 'classnames'

import styles from './index.scss'

export default class Item extends Component {
  handleClick = () => {
    const { data, onSelect } = this.props
    onSelect(data)
  }

  render() {
    const { data, inputValue, isFocused } = this.props
    const start = data.split(inputValue)[0]

    return (
      <div
        className={classNames(styles.item, { 'is-focus': isFocused })}
        onClick={this.handleClick}
      >
        <span>{start}</span>
        {data.length > start.length && (
          <>
            <span className="highlight">{inputValue}</span>
            <span>{data.slice(start.length + inputValue.length)}</span>
          </>
        )}
      </div>
    )
  }
}
