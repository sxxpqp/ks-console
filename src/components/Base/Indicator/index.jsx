import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import styles from './index.scss'

export default class Indicator extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    type: PropTypes.string,
    flicker: PropTypes.bool,
  }

  static defaultProps = {
    type: 'Running',
    flicker: false,
  }

  render() {
    const { className, type, flicker } = this.props

    return (
      <i
        className={classNames(
          styles.icon,
          styles[type.toLowerCase()],
          {
            [styles.flicker]: flicker,
          },
          className
        )}
      />
    )
  }
}
