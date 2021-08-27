import React from 'react'
import PropTypes from 'prop-types'
import { debounce } from 'lodash'

import { Select, Input } from '@kube-design/components'

import styles from './index.scss'

export default class CookieMatch extends React.Component {
  static propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func,
    matchTypes: PropTypes.array,
  }

  static defaultProps = {
    value: {},
    onChange() {},
    matchTypes: ['exact', 'regex'],
  }

  constructor(props) {
    super(props)

    const match = Object.keys(props.value)[0] || this.matchTypes[0].value
    this.state = {
      match,
      value: props.value[match] || '',
    }
  }

  get matchTypes() {
    const { matchTypes } = this.props
    return [
      { label: t('Exact Match'), value: 'exact' },
      { label: t('Prefix Match'), value: 'prefix' },
      { label: t('Regex Match'), value: 'regex' },
    ].filter(({ value }) => matchTypes.includes(value))
  }

  triggerChange = debounce(() => {
    const { match, value } = this.state
    const { onChange } = this.props

    if (match) {
      onChange({ [match]: value || '' })
    }
  }, 200)

  handleMatchChange = value => {
    this.setState({ match: value }, () => {
      this.triggerChange()
    })
  }

  handleValueChange = (e, value) => {
    this.setState({ value }, () => {
      this.triggerChange()
    })
  }

  render() {
    const { match, value } = this.state

    return (
      <div className={styles.match}>
        <Select
          value={match}
          options={this.matchTypes}
          onChange={this.handleMatchChange}
        />
        <Input
          value={value}
          placeholder={this.props.placeholder || 'key=value'}
          onChange={this.handleValueChange}
        />
      </div>
    )
  }
}
