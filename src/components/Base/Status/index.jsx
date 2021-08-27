import { isUndefined } from 'lodash'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Indicator from '../Indicator'

import styles from './index.scss'

export default class Status extends PureComponent {
  static propTypes = {
    style: PropTypes.string,
    className: PropTypes.string,
    name: PropTypes.string,
    total: PropTypes.number,
    ready: PropTypes.number,
    type: PropTypes.string,
    flicker: PropTypes.bool,
  }

  static defaultProps = {
    type: 'Running',
    flicker: false,
  }

  render() {
    const { style, className, name, type, total, ready, flicker } = this.props

    return (
      <span className={classNames(styles.status, className)} style={style}>
        <Indicator className={styles.indicator} type={type} flicker={flicker} />
        <span className="font-bold">{name}</span>
        {!isUndefined(total) && !isUndefined(ready) && (
          <span>
            &nbsp;({ready}/{total})
          </span>
        )}
      </span>
    )
  }
}
