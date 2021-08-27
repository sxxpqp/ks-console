import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { Tooltip, Icon } from '@kube-design/components'

import Link from './Link'

import styles from './index.scss'

export default class NavItem extends React.Component {
  static propTypes = {
    item: PropTypes.object,
    current: PropTypes.string,
    prefix: PropTypes.string,
    onClick: PropTypes.func,
    onOpen: PropTypes.func,
    disabled: PropTypes.bool,
  }

  checkSelect = (item = {}) => {
    const { current } = this.props

    if (item.children) {
      return item.children.some(child => this.checkSelect(child))
    }

    if (item.tabs) {
      return item.tabs.some(tab => this.checkSelect(tab))
    }

    return current.startsWith(item.name)
  }

  handleOpen = () => {
    const { onOpen, item } = this.props
    onOpen(item.name)
  }

  renderDisabledTip(item) {
    if (item.reason === 'CLUSTER_UPGRADE_REQUIRED') {
      return (
        <Tooltip
          content={t(item.reason, { version: item.requiredClusterVersion })}
          placement="topRight"
        >
          <Icon
            name="update"
            className={styles.tip}
            color={{
              primary: '#ffc781',
              secondary: '#f5a623',
            }}
          />
        </Tooltip>
      )
    }

    return null
  }

  render() {
    const { item, prefix, disabled, onClick, isOpen } = this.props
    const itemDisabled = (disabled || item.disabled) && !item.showInDisable

    if (item.children) {
      return (
        <li
          className={classnames({
            [styles.childSelect]: this.checkSelect(item),
            [styles.open]: item.open || isOpen,
            [styles.disabled]: itemDisabled,
          })}
        >
          <div className={styles.title} onClick={this.handleOpen}>
            <Icon name={item.icon} />
            {t(item.title)}
            {!item.open && (
              <Icon name="chevron-down" className={styles.rightIcon} />
            )}
          </div>
          <ul className={styles.innerNav}>
            {item.children.map(child => {
              const childDisabled =
                (disabled || child.disabled) && !child.showInDisable
              return (
                <li
                  key={child.name}
                  className={classnames({
                    [styles.select]: this.checkSelect(child),
                    [styles.disabled]: childDisabled,
                  })}
                >
                  {/* 增加链接的场景 */}
                  {child.link ? (
                    <a
                      href={child.link}
                      disabled={childDisabled}
                      target="_blank"
                    >
                      {t(child.title)}
                    </a>
                  ) : (
                    <Link
                      to={`${prefix}/${child.name}`}
                      disabled={childDisabled}
                    >
                      {t(child.title)}
                      {childDisabled && this.renderDisabledTip(child)}
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </li>
      )
    }

    return (
      <li
        key={item.name}
        className={classnames({
          [styles.select]: this.checkSelect(item),
          [styles.disabled]: itemDisabled,
        })}
      >
        <Link
          to={`${prefix}/${item.name}`}
          onClick={onClick}
          disabled={itemDisabled}
        >
          <Icon name={item.icon} /> {t(item.title)}
          {itemDisabled && this.renderDisabledTip(item)}
        </Link>
      </li>
    )
  }
}
