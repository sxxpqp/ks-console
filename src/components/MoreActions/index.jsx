import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import { Button, Icon, Dropdown, Menu } from '@kube-design/components'

export default class BtnGroup extends Component {
  static propTypes = {
    className: PropTypes.string,
    options: PropTypes.array,
  }

  static defaultProps = {
    options: [],
  }

  handleMoreClick = (e, key) => {
    const { onClick } = this.props.options.find(item => item.key === key)
    onClick && onClick()
  }

  renderMoreOptions() {
    const { options } = this.props

    const items = options.map(({ icon, text, show = true, ...rest }) => {
      if (!show) return null
      return (
        <Menu.MenuItem {...rest}>
          {icon && <Icon name={icon} type="light" />}{' '}
          <span data-test={`detail-${rest.key}`}>{text}</span>
        </Menu.MenuItem>
      )
    })

    if (items.every(item => item === null)) {
      return null
    }

    return <Menu onClick={this.handleMoreClick}>{items}</Menu>
  }

  render() {
    const { options, className } = this.props

    if (isEmpty(options)) return null

    const content = this.renderMoreOptions()

    return content ? (
      <Dropdown theme="dark" content={content}>
        <Button className={className} type="flat" icon="more" />
      </Dropdown>
    ) : null
  }
}
