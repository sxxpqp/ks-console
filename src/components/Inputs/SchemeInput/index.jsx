import React from 'react'
import { Select, Input } from '@kube-design/components'
import { SCHEME_OPTIONS, SCHEME_REG } from 'utils/constants'
import styles from './index.scss'

export default class SchemeInput extends React.Component {
  static defaultProps = {
    className: '',
    value: '',
    onChange: () => {},
  }

  get inputValue() {
    const { value } = this.props
    const [, , , inputValue = ''] = value.match(SCHEME_REG) || []
    return inputValue
  }

  get schemeValue() {
    const { value } = this.props
    const [, schemeValue = 'https://'] = value.match(SCHEME_REG) || []
    return schemeValue
  }

  handleInputChange = (e, value) => {
    value = value.toLowerCase()
    const [, schemeValue = this.schemeValue, , inputValue = ''] =
      value.match(SCHEME_REG) || []
    this.props.onChange(`${schemeValue}${inputValue}`)
  }

  handleSchemeChange = value => {
    this.props.onChange(`${value}${this.inputValue}`)
  }

  render() {
    return (
      <div className={styles.container}>
        <Select
          value={this.schemeValue}
          className={styles.select}
          options={SCHEME_OPTIONS}
          onChange={this.handleSchemeChange}
        />
        <Input
          className={styles.input}
          onChange={this.handleInputChange}
          value={this.inputValue}
          autoComplete="off"
        />
      </div>
    )
  }
}
