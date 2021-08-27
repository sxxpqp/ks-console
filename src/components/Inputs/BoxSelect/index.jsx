import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Icon } from '@kube-design/components'

import styles from './index.scss'

export default class BoxSelect extends React.Component {
  static propTypes = {
    options: PropTypes.array,
    value: PropTypes.array,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    options: [],
    value: [],
    onChange() {},
  }

  handleClick = e => {
    const targetValue = e.currentTarget.dataset.value
    const { value, onChange } = this.props

    if (value.includes(targetValue)) {
      onChange(value.filter(item => item !== targetValue))
    } else {
      onChange([...value, targetValue])
    }
  }

  render() {
    const { options, value } = this.props
    return (
      <ul className={styles.wrapper}>
        {options.map(option => (
          <li
            className={classNames({
              [styles.select]: value.includes(option.value),
            })}
            key={option.value}
            data-value={option.value}
            onClick={this.handleClick}
          >
            {option.icon && <Icon name={option.icon} size={24} />}
            {option.label}
          </li>
        ))}
      </ul>
    )
  }
}
