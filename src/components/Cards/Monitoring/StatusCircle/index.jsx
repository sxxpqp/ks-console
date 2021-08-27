import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { get } from 'lodash'

import { SimpleCircle } from 'components/Charts'

import styles from './index.scss'

export default class StatusCircle extends React.Component {
  static propTypes = {
    theme: PropTypes.string,
    className: PropTypes.string,
    name: PropTypes.string,
    legend: PropTypes.array,
    used: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    unit: PropTypes.string,
    showRate: PropTypes.bool,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    theme: 'dark',
    name: 'Status',
    legend: ['Used', 'Total'],
    used: 0,
    total: 0,
    unit: '',
    showRate: false,
  }

  get usageRate() {
    const { used, total } = this.props
    return total
      ? parseInt((parseFloat(used) / parseFloat(total)) * 100, 10)
      : 0
  }

  handleClick = () => {
    const { onClick } = this.props
    onClick && onClick()
  }

  render() {
    const {
      theme,
      className,
      name,
      legend,
      used,
      total,
      unit,
      showRate,
      onClick,
    } = this.props
    const nameText = t(name)
    const usedText = t(get(legend, '[0]', ''))
    const totalText = t(get(legend, '[1]', ''))

    return (
      <div
        className={classnames(styles.card, className, styles[theme], {
          [styles.cursor]: !!onClick,
        })}
        onClick={this.handleClick}
      >
        <img className={styles.cardImg} src="/assets/banner-icon-1.svg" />
        <div className={styles.chart}>
          <SimpleCircle
            theme={theme}
            width="100%"
            height="100%"
            title={nameText}
            legend={legend}
            value={parseFloat(used)}
            total={parseFloat(total)}
            unit={unit}
            showRate={showRate}
          />
        </div>
        <div className={styles.status}>
          <div className={styles.title}>{nameText}</div>
          <div className={styles.detail}>
            <p>
              <label>{usedText}:</label> {used} {unit}
            </p>
            <p>
              <label>{totalText}:</label> {total} {unit}
            </p>
          </div>
        </div>
      </div>
    )
  }
}
