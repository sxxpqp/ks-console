import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import styles from './index.scss'

export default class EmptyCard extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    desc: PropTypes.string,
    onCreate: PropTypes.func,
  }

  render() {
    const { className, desc } = this.props

    return (
      <div className={classnames(styles.wrapper, className)}>
        <div>
          <img src="/assets/empty-card.svg" alt="" />
        </div>
        <div>
          <p
            className={styles.desc}
            dangerouslySetInnerHTML={{
              __html: desc,
            }}
          />
          {this.props.children}
        </div>
      </div>
    )
  }
}
