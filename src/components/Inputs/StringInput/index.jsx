import React from 'react'
import PropTypes from 'prop-types'
import { isString, isArray } from 'lodash'
import { TextArea } from '@kube-design/components'

const defaultStringify = value => (isArray(value) ? value.join(',') : '')
const defaultParser = value =>
  isString(value)
    ? value.split(',').map(str => {
        if (/^["'].*["']$/.test(str)) {
          str = str.slice(1, str.length - 1)
        }
        return str
      })
    : []

export default class StringInput extends React.Component {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    stringify: PropTypes.func,
    parser: PropTypes.func,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    value: '',
    stringify: defaultStringify,
    parser: defaultParser,
    onChange() {},
  }

  constructor(props) {
    super(props)

    this.state = {
      value: props.stringify(props.value),
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value && this.props.value) {
      this.setState({ value: this.props.stringify(this.props.value) })
    }
  }

  handleChange = value => {
    const { onChange, parser } = this.props

    this.setState({ value })
    onChange(value ? parser(value) : [])
  }

  render() {
    const { value, onChange, parser, stringify, ...rest } = this.props

    return (
      <TextArea
        value={this.state.value}
        {...rest}
        onChange={this.handleChange}
        rows={2}
      />
    )
  }
}
