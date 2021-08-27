import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { COLORS_MAP } from 'utils/constants'

import { Icon } from '@kube-design/components'

import styles from './index.scss'

class NumberControl extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    value: PropTypes.number,
    onChange: PropTypes.func,
  }

  handlePlusOne = () => {
    const { value, onChange } = this.props
    onChange && onChange(value + 1)
  }

  handleMinusOne = () => {
    const { value, onChange } = this.props
    onChange && onChange(value - 1)
  }

  render() {
    const { className } = this.props
    const color = {
      primary: COLORS_MAP['white'],
      secondary: COLORS_MAP['white'],
    }

    return (
      <div className={classnames(styles.control, className)}>
        <Icon
          className={styles.add}
          name="chevron-up"
          size={24}
          color={color}
          onClick={this.handlePlusOne}
          clickable
        />
        <Icon
          className={styles.substract}
          name="chevron-down"
          size={24}
          color={color}
          onClick={this.handleMinusOne}
          clickable
        />
      </div>
    )
  }
}

export default NumberControl
