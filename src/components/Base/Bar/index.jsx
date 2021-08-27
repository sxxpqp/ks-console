import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import styles from './index.scss'

export default class Bar extends React.Component {
  static propTypes = {
    value: PropTypes.number.isRequired,
    className: PropTypes.string,
  }

  static defaultProps = {
    value: 0,
  }

  render() {
    const { value, className, text, rightText } = this.props

    const style = {
      width: `${value * 100}%`,
    }

    let type = 'default'
    if (value >= 0.8) {
      type = 'warning'
    }
    if (value >= 0.95) {
      type = 'danger'
    }

    const textStyle = {
      left: value > 0.35 ? `${(value / 2) * 100}%` : `${(value + 0.01) * 100}%`,
      transform: value > 0.35 ? 'translateX(-50%)' : '',
      color: value > 0.35 ? '#fff' : '#79879c',
    }

    return (
      <div className={classnames(styles.wrapper, className)}>
        <div className={classnames(styles.bar, styles[type])} style={style} />
        {text && !!value && (
          <span className={styles.text} style={textStyle}>
            {text}
          </span>
        )}
        {rightText && <span className={styles.rightText}>{rightText}</span>}
      </div>
    )
  }
}
