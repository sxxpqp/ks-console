import React from 'react'
import { PropTypes } from 'prop-types'
import classnames from 'classnames'
import { Toggle } from '@kube-design/components'

import styles from './index.scss'

export default class ToggleSimple extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    title: PropTypes.string,
  }

  static defaultProps = {
    label: 'Advanced Settings',
    title: '',
  }

  state = {
    show: this.props.defaultShow || false,
  }

  toggle = () => {
    this.setState(({ show }) => ({
      show: !show,
    }))
    this.props.onChange && this.props.onChange(this.state.show)
  }

  renderToggle() {
    const { show } = this.state

    return (
      <span>
        <Toggle onChange={this.toggle} checked={show} />
      </span>
    )
  }

  render() {
    const { title } = this.props

    return (
      <>
        <div
          className={classnames(
            title ? styles.switch : styles.inline,
            'font-bold margin-b12'
          )}
        >
          {title && <span>{title}</span>}
          <span className="text-secondary align-middle">
            {this.renderToggle()}
            {this.label || ` 全部配置 `}
          </span>
        </div>
      </>
    )
  }
}
