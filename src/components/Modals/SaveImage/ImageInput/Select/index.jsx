import React from 'react'
import PropTypes from 'prop-types'
import { debounce, isEmpty, isUndefined } from 'lodash'
import isEqual from 'react-fast-compare'
import classNames from 'classnames'
import { Icon, Dropdown } from '@kube-design/components'

import styles from './index.scss'

export default class Select extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    value: PropTypes.any,
    defaultValue: PropTypes.any,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    className: '',
    defaultValue: '',
    options: [],
    onChange() {},
  }

  constructor(props) {
    super(props)

    this.state = {
      value: isUndefined(props.value) ? props.defaultValue : props.value,
      showOptions: false,
    }

    this.optionsRef = React.createRef()
  }

  triggerChange = debounce(() => {
    const { onChange } = this.props

    onChange(this.state.value)
  })

  handleClick = value => {
    this.setState({ value, showOptions: false }, () => {
      this.triggerChange()
    })
  }

  toggleShowOptions = () => {
    this.setState(({ showOptions }) => {
      !showOptions
    })
  }

  handleShowOptions = () => {
    this.setState({ showOptions: true })
  }

  handleHideOptions = () => {
    this.setState({ showOptions: false })
  }

  renderOption(option, selected) {
    const onClick = () => this.handleClick(option.value)
    return (
      <div
        key={option.uid || option.value}
        onClick={onClick}
        className={classNames(styles.option, { [styles.selected]: selected })}
      >
        {option.label}
      </div>
    )
  }

  renderOptions() {
    const { options, disabled } = this.props
    const { value } = this.state

    if (disabled || isEmpty(options)) {
      return null
    }

    const selectOption = options.find(item => isEqual(item.value, value))

    return (
      <div className={styles.options}>
        {selectOption && this.renderOption(selectOption, true)}
        {options
          .filter(item => !isEqual(item.value, value))
          .map(option => this.renderOption(option))}
      </div>
    )
  }

  renderControl() {
    const { value, defaultValue, placeholder, options, disabled } = this.props

    const _value = value || defaultValue

    const option =
      options.find(item => isEqual(item.value, _value)) || placeholder || {}

    return (
      <div className={styles.control}>
        <span className={styles.label}>{option.label}</span>
        {!disabled && (
          <Icon
            className={classNames(styles.rightIcon, {
              [styles.rightIcon_toggle]: this.state.showOptions,
            })}
            name="chevron-down"
            size={20}
          />
        )}
      </div>
    )
  }

  render() {
    const { className, disabled } = this.props
    return (
      <div
        className={classNames(
          styles.wrapper,
          { [styles.disabled]: disabled },
          className
        )}
      >
        <Dropdown
          closeAfterClick={false}
          onClick={this.toggleShowOptions}
          visible={this.state.showOptions}
          onOpen={this.handleShowOptions}
          onClose={this.handleHideOptions}
          content={this.renderOptions()}
        >
          {this.renderControl()}
        </Dropdown>
      </div>
    )
  }
}
