import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { isFunction, omit, noop } from 'lodash'
import styles from './index.scss'

class Input extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    type: PropTypes.string,
    className: PropTypes.string,
    size: PropTypes.oneOf(['small', 'default', 'large']),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    // Handler
    onChange: PropTypes.func,
    onPressEnter: PropTypes.func,
    onKeyDown: PropTypes.func,
  }

  static defaultProps = {
    type: 'text',
    size: 'default',
    disabled: false,
    onChange: noop,
    onPressEnter: noop,
    onKeyDown: noop,
    defaultValue: '',
  }

  constructor(props) {
    super(props)
    this.state = {
      value: String(props.value || props.defaultValue),
      isFocus: false,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if ('value' in nextProps && nextProps.value !== prevState.value) {
      return {
        value: nextProps.value,
      }
    }
    return null
  }

  focus = () => {
    this.node.focus()
  }

  blur = () => {
    this.node.blur()
  }

  handleChange = e => {
    const { value } = e.target
    const { value: propsValue, onChange } = this.props
    const newValue = propsValue || value

    this.setState({ value: newValue })
    if (onChange !== noop) {
      onChange(e, value)
    }
  }

  handleKeyDown = e => {
    const { onPressEnter, onKeyDown } = this.props
    if (e.keyCode === 13 && onPressEnter) {
      onPressEnter(e)
    }
    if (onKeyDown) {
      onKeyDown(e)
    }
  }

  render() {
    const { className, size, disabled, children, ...restProps } = this.props
    const { value } = this.state

    return (
      <span
        className={classNames(styles.input, className, {
          [`is-${size}`]: size,
        })}
      >
        {children}
        <input
          {...omit(
            restProps,
            'schemas',
            'onKeyDown',
            'onPressEnter',
            'onChange',
            'value',
            'defaultValue',
            'validateStatus',
            'validateHelp',
            'validateIcon',
            'validateOnChange',
            'validateOnBlur'
          )}
          disabled={isFunction(disabled) ? disabled() : disabled}
          onKeyDown={this.handleKeyDown}
          onChange={this.handleChange}
          value={value}
          ref={node => {
            this.node = node
          }}
          data-test="imageSearch"
        />
        <span className={classNames(styles.border, 'input')} />
      </span>
    )
  }
}

export default Input
