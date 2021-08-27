import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import styles from './index.scss'

export default class AddonsInput extends React.Component {
  static propTypes = {
    prefix: PropTypes.any,
    suffix: PropTypes.any,
    name: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func,
  }

  render() {
    const { prefix, suffix, children, ...rest } = this.props

    const childNode = React.cloneElement(children, {
      ...children.props,
      className: classNames(
        {
          'ks-input-addons-prefix': !!prefix,
          'ks-input-addons-suffix': !!suffix,
        },
        children.props.className
      ),
      ...rest,
    })

    return (
      <div className={classNames(styles.wrapper, 'ks-input-addons')}>
        {prefix && <div className={styles.text}>{prefix}</div>}
        {childNode}
        {suffix && <div className={styles.text}>{suffix}</div>}
      </div>
    )
  }
}
