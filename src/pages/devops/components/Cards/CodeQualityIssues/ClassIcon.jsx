import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import styles from './index.scss'

export default class Status extends PureComponent {
  static propTypes = {
    errorClass: PropTypes.string,
    className: PropTypes.string,
  }

  static defaultProps = {
    errorClass: '',
    className: '',
  }

  render() {
    const { errorClass, className } = this.props

    return (
      <span className={styles.codeStatus}>
        <span
          className={classNames(
            'codequality-icon',
            styles[errorClass],
            className
          )}
        />
        {t(errorClass)}
      </span>
    )
  }
}
