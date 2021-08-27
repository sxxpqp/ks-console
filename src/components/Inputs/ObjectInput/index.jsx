import { get, set, isUndefined, isObject } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import styles from './index.scss'

export default class ObjectInput extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    value: PropTypes.object,
    defaultValue: PropTypes.object,
    onChange: PropTypes.func,
    children: PropTypes.node.isRequired,
  }

  static defaultProps = {
    name: '',
    value: {},
    onChange() {},
  }

  handleChildChange = (name, childOnChange, childValue) => {
    const { onChange } = this.props
    let { value = {} } = this.props

    value = isObject(value) ? value : {}
    childValue = get(childValue, 'currentTarget.value', childValue)

    set(value, name, childValue)

    onChange({ ...value })

    if (childOnChange) {
      childOnChange(childValue)
    }
  }

  getValue = (name, childDefaultValue) => {
    const value = get(this.props.value, name)
    const defaultValue = get(this.props.defaultValue, name)

    if (!isUndefined(value)) {
      return value
    }

    if (!isUndefined(defaultValue)) {
      set(this.props.value, name, defaultValue)
      return defaultValue
    }

    set(this.props.value, name, childDefaultValue)

    return childDefaultValue
  }

  render() {
    const { className, value, children } = this.props

    const childNodes = React.Children.map(children, child =>
      React.cloneElement(child, {
        ...child.props,
        className: classNames(child.props.className, styles.item),
        value: isUndefined(value)
          ? child.props.value
          : this.getValue(child.props.name, child.props.defaultValue),
        onChange: this.handleChildChange.bind(
          this,
          child.props.name,
          child.props.onChange
        ),
      })
    )

    return (
      <div className={classNames(styles.wrapper, className)}>{childNodes}</div>
    )
  }
}
