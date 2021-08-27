import React from 'react'
import { isEmpty, isUndefined } from 'lodash'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { RadioButton, RadioGroup, Badge } from '@kube-design/components'

export default class RadioGroupWithOptions extends React.Component {
  static propTypes = {
    options: PropTypes.array,
    value: PropTypes.any,
    onChange: PropTypes.func,
  }

  render() {
    const { value, options, onChange, ...rest } = this.props

    if (isEmpty(options)) {
      return null
    }

    return (
      <RadioGroup
        wrapClassName={classNames('radio-group-button', {
          'radio-with-badge': options.every(
            option => !isUndefined(option.count)
          ),
        })}
        value={value}
        onChange={onChange}
        {...rest}
      >
        {options
          .filter(option => !option.hidden)
          .map(option => (
            <RadioButton key={option.value} value={option.value}>
              {option.label}
              {!isUndefined(option.count) && (
                <Badge
                  status={option.value === value ? 'success' : 'default'}
                  count={Number(option.count)}
                />
              )}
            </RadioButton>
          ))}
      </RadioGroup>
    )
  }
}
