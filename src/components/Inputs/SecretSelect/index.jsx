import React from 'react'
import PropTypes from 'prop-types'
import { Select } from '@kube-design/components'

import { getDisplayName } from 'utils'

import styles from './index.scss'

export default class EnvironmentInputItem extends React.Component {
  static propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func,
    secrets: PropTypes.array,
  }

  static defaultProps = {
    name: '',
    value: {},
    onChange() {},
    secrets: [],
  }

  getResourceOptions() {
    const { secrets } = this.props

    return secrets.map(item => ({
      label: getDisplayName(item),
      value: item.name,
    }))
  }

  getKeysOptions() {
    const { value, secrets } = this.props

    const data = secrets.find(item => item.name === value.name)

    if (!data) {
      return []
    }

    return Object.keys(data.data || {}).map(key => ({
      label: key,
      value: key,
    }))
  }

  handleNameChange = name => {
    const { onChange } = this.props
    onChange({ name })
  }

  handleKeyChange = key => {
    const { value, onChange } = this.props
    onChange({ name: value.name, key })
  }

  render() {
    const { name, value = {} } = this.props
    return (
      <div className={styles.wrapper}>
        <Select
          name="name"
          key={`${name}.name`}
          value={value.name}
          prefixIcon={`${t('Secret')}: `}
          options={this.getResourceOptions()}
          onChange={this.handleNameChange}
        />
        <Select
          name="key"
          key={`${name}.key`}
          value={value.key}
          prefixIcon={`${t('Key')}: `}
          options={this.getKeysOptions()}
          onChange={this.handleKeyChange}
        />
      </div>
    )
  }
}
