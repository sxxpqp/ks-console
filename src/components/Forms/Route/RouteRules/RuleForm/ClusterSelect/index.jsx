import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Icon, Checkbox, CheckboxGroup } from '@kube-design/components'
import { CLUSTER_PROVIDER_ICON } from 'utils/constants'

import styles from './index.scss'

export default class ClusterSelect extends Component {
  static propTypes = {
    value: PropTypes.array,
    options: PropTypes.array,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    value: [],
    options: [],
    onChange() {},
  }

  render() {
    const { value, defaultValue, onChange, options } = this.props

    return (
      <div className={styles.group}>
        <CheckboxGroup
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
        >
          {options.map(option => (
            <Checkbox key={option.name} value={option.name}>
              <Icon
                name={CLUSTER_PROVIDER_ICON[option.provider] || 'kubernetes'}
              />
              <span>{option.name}</span>
            </Checkbox>
          ))}
        </CheckboxGroup>
      </div>
    )
  }
}
