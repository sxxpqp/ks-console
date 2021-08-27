import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import styles from './index.scss'

export default class Status extends PureComponent {
  static propTypes = {
    label: PropTypes.string,
    className: PropTypes.string,
    type: PropTypes.string,
    hasLabel: PropTypes.bool,
  }

  static defaultProps = {
    type: '',
    label: '',
    hasLabel: true,
  }

  render() {
    const { className, type, label, hasLabel } = this.props

    return (
      <span>
        <span
          className={classNames(
            'pipeline_status_icon',
            styles[type.toLowerCase()],
            className
          )}
        />
        {hasLabel && (label || t(type.toLowerCase()))}
      </span>
    )
  }
}
