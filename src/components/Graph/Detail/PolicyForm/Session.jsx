import { debounce } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { Select, Input } from '@kube-design/components'

const parseCookie = str => {
  let status = true
  const arr = str.replace(/\s+/g, '').split(';')
  const result = {}
  for (let i = 0; i < arr.length; i++) {
    const cur = arr[i].split('=')
    if (cur.length > 1) {
      result[cur[0]] = cur[1]
    } else {
      status = false
    }
  }
  return { result, status }
}

export default class Session extends React.Component {
  static propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    value: {},
    onChange() {},
  }

  constructor(props) {
    super(props)

    const options = this.getOptions()

    const type = Object.keys(props.value)[0] || options[0].value
    let value = props.value[type]

    if (type === 'httpCookie' && value) {
      value = Object.entries(value)
        .map(([key, _value]) => `${key}=${_value}`)
        .join('; ')
    }

    this.state = { type, value, propsValue: props.value }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.value !== state.propsValue) {
      const newType = Object.keys(props.value)[0]
      let newValue = props.value[newType]

      if (newType === 'httpCookie' && newValue) {
        newValue = Object.entries(newValue)
          .map(([key, _value]) => `${key}=${_value}`)
          .join('; ')
      }

      return { type: newType, value: newValue, propsValue: props.value }
    }

    return null
  }

  triggerChange = debounce(value => {
    this.props.onChange(value)
  }, 500)

  handleTypeChange = type => {
    this.setState({ type, value: '' }, () => {
      if (type === 'useSourceIp') {
        this.triggerChange({ [type]: true })
      } else {
        this.triggerChange({ [type]: '' })
      }
    })
  }

  handleValueChange = (e, value) => {
    this.setState({ value }, () => {
      const { type } = this.state
      if (type === 'httpCookie') {
        const { parsedValue, status } = parseCookie(value)
        if (status) {
          this.triggerChange({ [type]: parsedValue })
        }
      } else {
        this.triggerChange({ [type]: value })
      }
    })
  }

  getOptions() {
    const { protocol } = this.props

    if (protocol === 'http') {
      return [
        {
          label: t('Hash based on a specific HTTP header.'),
          value: 'httpHeaderName',
        },
        { label: t('Hash based on HTTP cookie.'), value: 'httpCookie' },
        {
          label: t('Hash based on the source IP address.'),
          value: 'useSourceIp',
        },
      ]
    }

    return [
      {
        label: t('Hash based on the source IP address.'),
        value: 'useSourceIp',
      },
    ]
  }

  render() {
    const { type, value } = this.state

    return (
      <div>
        <Select
          value={type}
          options={this.getOptions()}
          onChange={this.handleTypeChange}
        />
        {type === 'httpHeaderName' && (
          <>
            <div className="margin-t12">{t('Based on HTTP header')}</div>
            <Input value={value} onChange={this.handleValueChange} />
          </>
        )}
        {type === 'httpCookie' && (
          <>
            <div className="margin-t12">{t('Based on HTTP cookie')}</div>
            <Input
              value={value}
              onChange={this.handleValueChange}
              placeholder="key1=val1; key2=val2"
            />
          </>
        )}
      </div>
    )
  }
}
