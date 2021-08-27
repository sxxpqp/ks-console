import React, { Component } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { Icon } from '@kube-design/components'
import { isArray } from 'lodash'
import styles from './index.scss'

export default class CardSelect extends Component {
  static propTypes = {
    options: PropTypes.array,
    value: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    selectedClassName: PropTypes.string,
    iconSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }

  static defaultProps = {
    selectedClassName: styles.selected,
  }

  handleClick = e => {
    const targetValue = e.currentTarget.dataset.value
    const { value, onChange } = this.props

    if (isArray(value)) {
      if (value.includes(targetValue)) {
        onChange(value.filter(item => item !== targetValue))
      } else {
        onChange([...value, targetValue])
      }
    } else {
      onChange(targetValue)
    }
  }

  selectedCheck = optValue => {
    const { value } = this.props
    return isArray(value) ? value.includes(optValue) : optValue === value
  }

  render() {
    const { className, options, selectedClassName } = this.props
    return (
      <ul className={classnames(styles.container, className)}>
        {options.map(
          ({ icon = 'picture', image, label, value, description }) => (
            <li
              key={value}
              data-value={value}
              onClick={this.handleClick}
              className={classnames({
                [selectedClassName]: this.selectedCheck(value),
              })}
            >
              <figure>
                {image ? <img src={image} /> : <Icon name={icon} />}
              </figure>
              <h3>{label}</h3>
              {description && <p>{description}</p>}
            </li>
          )
        )}
      </ul>
    )
  }
}
