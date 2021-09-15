import React from 'react'
import { PropTypes } from 'prop-types'
import classNames from 'classnames'
import { Icon } from '@kube-design/components'

import styles from './index.scss'

export default class ToggleView extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    show: PropTypes.bool,
    hasClose: PropTypes.bool,
  }

  static defaultProps = {
    title: '',
    description: '',
    show: false,
    hasClose: false,
  }

  state = {
    show: this.props.show,
    close: false,
  }

  toggle = () => {
    this.setState(({ show }) => ({
      show: !show,
    }))
  }

  close = () => {
    this.setState({ close: true })
  }

  render() {
    const { className, title, hasClose, description, children } = this.props
    const { show, close } = this.state

    return (
      <div
        className={classNames(
          styles.item,
          {
            [styles.hideBg]: !show,
            [styles.close]: close,
          },
          className
        )}
      >
        <div className={styles.name} onClick={this.toggle}>
          <Icon name={show ? 'chevron-down' : 'chevron-right'} size={20} />
          {title}
          {hasClose && !show && (
            <Icon
              onClick={this.close}
              name={'close'}
              size={20}
              className={styles.closeIcon}
            />
          )}
        </div>
        <div
          className={classNames(styles.detail, {
            [styles.more]: !show,
          })}
        >
          {description || children}
        </div>
      </div>
    )
  }
}
