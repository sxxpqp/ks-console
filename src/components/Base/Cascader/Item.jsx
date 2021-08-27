import React, { Component } from 'react'
import classNames from 'classnames'
import { Icon } from '@kube-design/components'
import Options from './Options'

import styles from './index.scss'

export default class Item extends Component {
  ref = React.createRef()

  getOptionsStyle() {
    const style = {}
    if (this.ref && this.ref.current) {
      const { data } = this.props
      if (data.children) {
        const len = Math.min(data.children.length, 8)
        const triggerStyle = this.ref.current.getBoundingClientRect()
        const parentStyle = this.ref.current.parentNode.getBoundingClientRect()
        if (triggerStyle.top - parentStyle.top > parentStyle.height / 2) {
          style.top = triggerStyle.top - 4 - (len - 1) * 32
        } else {
          style.top = triggerStyle.top - 4
        }
        style.left = triggerStyle.left + triggerStyle.width
        if (window.innerHeight - style.top < 252) {
          style.maxHeight = window.innerHeight - style.top - 8
        }
      }
    }
    return style
  }

  handleClick = () => {
    const { data, onClick } = this.props
    onClick(data.value)
  }

  handleSelect = () => {
    const { data, onSelect } = this.props
    onSelect(data.value)
  }

  render() {
    const { data, level, isOpen, onSelect } = this.props

    if (!data.children) {
      return (
        <div className={styles.item} onClick={this.handleSelect}>
          {data.label}
        </div>
      )
    }

    return (
      <div ref={this.ref}>
        <div
          className={classNames(styles.item, styles.hasChildren, {
            [styles.isOpen]: isOpen,
          })}
          onClick={this.handleClick}
        >
          {data.label}
          <Icon name="chevron-right" type="light" />
        </div>
        {isOpen && (
          <Options
            level={level + 1}
            options={data.children}
            onSelect={onSelect}
            style={this.getOptionsStyle()}
          />
        )}
      </div>
    )
  }
}
