import React, { Component } from 'react'

import Options from './Options'

import styles from './index.scss'

export default class Cascader extends Component {
  static defaultProps = {
    options: [],
    children: '',
    onSelect() {},
  }

  state = {
    isOpen: false,
  }

  ref = React.createRef()

  componentDidMount() {
    document.addEventListener('click', this.handleDOMClick)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDOMClick)
  }

  handleDOMClick = e => {
    if (this.ref && !this.ref.current.contains(e.target)) {
      this.setState({ isOpen: false })
    }
  }

  handleSelect = data => {
    this.props.onSelect(data)
    this.setState({ isOpen: false })
  }

  triggerOpen = () => {
    this.setState(({ isOpen }) => ({
      isOpen: !isOpen,
    }))
  }

  getOptionsStyle() {
    const style = {}
    if (this.ref && this.ref.current) {
      const triggerStyle = this.ref.current.getBoundingClientRect()
      if (
        window.innerHeight - triggerStyle.top >
        252 + 8 + triggerStyle.height
      ) {
        style.top = triggerStyle.top + triggerStyle.height + 8
      } else {
        style.top = triggerStyle.top - 8 - 252
      }
      style.left = triggerStyle.left
    }
    return style
  }

  render() {
    const { children, options } = this.props
    const { isOpen } = this.state

    return (
      <div className={styles.wrapper} ref={this.ref}>
        <div className={styles.trigger} onClick={this.triggerOpen}>
          {children}
        </div>
        {isOpen && (
          <Options
            style={this.getOptionsStyle()}
            options={options}
            level={0}
            onSelect={this.handleSelect}
          />
        )}
      </div>
    )
  }
}
