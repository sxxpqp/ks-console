import { get } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'

import { Input, Select } from '@kube-design/components'
import BoolSelect from 'components/Inputs/BoolSelect'

import ObjectInput from '../ObjectInput'

export default class S2IEnviroment extends React.Component {
  static propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func,
    configMaps: PropTypes.array,
    secrets: PropTypes.array,
  }

  static defaultProps = {
    value: {},
    onChange() {},
  }

  get valueType() {
    const { value, options } = this.props
    const key = get(value, 'name', '')
    const option = options.find(_option => _option.key === key)
    return get(option, 'type', 'string')
  }

  handleChange = obj => {
    const { options } = this.props
    const key = get(obj, 'name')
    const option = options.find(_option => _option.key === key)
    if (this.key !== key) {
      obj.value = get(option, 'defaultValue', '')
    }
    this.props.onChange(obj)
    this.key = key
  }

  render() {
    const { value, options } = this.props
    return (
      <ObjectInput value={value} onChange={this.handleChange}>
        <Select name="name" placeholder={t('key')} options={options} />
        {this.valueType === 'boolean' ? (
          <BoolSelect name="value" placeholder={t('value')} />
        ) : (
          <Input name="value" placeholder={t('value')} />
        )}
      </ObjectInput>
    )
  }
}
