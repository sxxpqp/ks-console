import React from 'react'
import PropTypes from 'prop-types'

import ArrayInput from '../ArrayInput'
import InputItem from './item'

export default class S2IEnviroment extends React.Component {
  static propTypes = {
    value: PropTypes.array,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    name: '',
    value: [],
    onChange() {},
  }

  render() {
    const { value = [], onChange, options, ...rest } = this.props
    return (
      <ArrayInput
        value={value}
        onChange={onChange}
        addText={t('Add Environment Variables')}
        {...rest}
      >
        <InputItem options={options} />
      </ArrayInput>
    )
  }
}
