import React from 'react'
import { PropTypes } from 'prop-types'
import classNames from 'classnames'
import { Icon } from '@kube-design/components'

import styles from './index.scss'

export default class ToggleView extends React.Component {
  static propTypes = {
    label: PropTypes.string,
  }

  static defaultProps = {
    label: 'Advanced Settings',
  }

  state = {
    show: this.props.defaultShow || false,
  }

  toggle = () => {
    this.setState(({ show }) => ({
      show: !show,
    }))
  }

  render() {
    const { label, children } = this.props
    const { show } = this.state
    return (
      <>
        <div className={styles.toggle} onClick={this.toggle}>
          <a>
            <span className="align-middle">{t(label)} </span>
            <Icon name={show ? 'chevron-up' : 'chevron-down'} />
          </a>
        </div>
        <div className={classNames({ [styles.children]: !show })}>
          {children}
        </div>
      </>
    )
  }
}
