import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { isEmpty, trim } from 'lodash'
import { Input, Button, Select } from '@kube-design/components'

import styles from './index.scss'

export default class BoxInput extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    defaultSelectValue: PropTypes.string,
    options: PropTypes.array,
    onSelectChange: PropTypes.func,
    onAdd: PropTypes.func,
    onDelete: PropTypes.func,
    validate: PropTypes.func,
  }

  static defaultProps = {
    title: '',
    defaultSelectValue: '',
    options: [],
    onAdd() {},
    onDelete() {},
    onSelectChange() {},
    validate() {},
  }

  state = {
    inputValue: '',
  }

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value })
  }

  handleAdd = () => {
    const { validate, onAdd } = this.props
    const { inputValue } = this.state

    if (validate(inputValue)) {
      this.setState({ inputValue: '' }, () => {
        onAdd(trim(inputValue))
      })
    }
  }

  handleDelete = (value, index) => {
    this.props.onDelete(value, index)
  }

  handleKeyUp = e => {
    if (e.keyCode === 13) {
      this.handleAdd()
    }
  }

  renderInput() {
    const {
      className,
      defaultSelectValue,
      options,
      onSelectChange,
      ...rest
    } = this.props
    const { inputValue } = this.state

    if (!isEmpty(options)) {
      return (
        <div className={classnames(styles.selectWrapper, className)}>
          <Input
            className={styles.selectInput}
            onChange={this.handleInputChange}
            value={inputValue}
            onKeyUp={this.handleKeyUp}
          />
          <Select
            className={styles.select}
            defaultValue={defaultSelectValue}
            options={options}
            onChange={onSelectChange}
          />
        </div>
      )
    }
    return (
      <Input
        value={inputValue}
        onKeyUp={this.handleKeyUp}
        onChange={this.handleInputChange}
        {...rest}
      />
    )
  }

  render() {
    const { className, title } = this.props
    return (
      <div className={className}>
        {title && <p className={styles.title}>{title}</p>}
        <div className={styles.inputWrapper}>
          {this.renderInput()}
          <Button className="margin-l12" onClick={this.handleAdd}>
            {t('Add')}
          </Button>
        </div>
      </div>
    )
  }
}
