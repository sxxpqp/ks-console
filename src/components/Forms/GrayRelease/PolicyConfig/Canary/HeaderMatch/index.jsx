import React from 'react'
import PropTypes from 'prop-types'
import { debounce, pick } from 'lodash'

import { Select, Input } from '@kube-design/components'

import styles from './index.scss'

const RESERVED_KEYS = ['cookie', 'User-Agent']

const getStateFromProps = props => {
  const keys = Object.keys(props.value).filter(
    item => !RESERVED_KEYS.includes(item)
  )
  const key = keys[0]
  const match = (key ? Object.keys(props.value[key])[0] : 'exact') || 'exact'
  const value = (key ? Object.values(props.value[key])[0] : '') || ''

  return { key, match, value }
}

export default class HeaderMatch extends React.Component {
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

    this.state = getStateFromProps(props)
  }

  get matchTypes() {
    return [
      { label: t('Exact Match'), value: 'exact' },
      { label: t('Regex Match'), value: 'regex' },
    ]
  }

  triggerChange = debounce(() => {
    const { match, key, value } = this.state
    const { onChange, value: propsValue } = this.props

    onChange({ [key]: { [match]: value }, ...pick(propsValue, RESERVED_KEYS) })
  }, 200)

  handleMatchChange = value => {
    this.setState({ match: value }, () => {
      this.triggerChange()
    })
  }

  handleKeyChange = (e, value) => {
    this.setState({ key: value }, () => {
      this.triggerChange()
    })
  }

  handleValueChange = (e, value) => {
    this.setState({ value }, () => {
      this.triggerChange()
    })
  }

  render() {
    const { match, key, value } = this.state
    return (
      <div className={styles.match}>
        <Select
          value={match}
          defaultValue="exact"
          options={this.matchTypes}
          onChange={this.handleMatchChange}
        />
        <Input value={key} placeholder="key" onChange={this.handleKeyChange} />
        <Input
          value={value}
          placeholder="value"
          onChange={this.handleValueChange}
        />
      </div>
    )
  }
}
