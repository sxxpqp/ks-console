import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import styles from './index.scss'

export default class Empty extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    img: PropTypes.string,
    desc: PropTypes.string,
  }

  static defaultProps = {
    img: '/assets/empty-card.svg',
    desc: 'No Relevant Data',
  }

  render() {
    const { className, img, desc } = this.props

    return (
      <div className={classnames(styles.wrapper, className)}>
        <img src={img} alt="No data" />
        <div className={styles.content}>{t(desc)}</div>
      </div>
    )
  }
}
