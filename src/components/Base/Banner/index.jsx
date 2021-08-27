import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { isString } from 'lodash'

import { Icon } from '@kube-design/components'

import styles from './index.scss'

export default class Banner extends React.PureComponent {
  static propTypes = {
    type: PropTypes.string,
    icon: PropTypes.string,
    rightIcon: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
      PropTypes.element,
    ]),
    name: PropTypes.string,
    desc: PropTypes.string,
  }

  static defaultProps = {
    type: 'light',
    icon: 'appcenter',
    iconClass: '',
    name: '',
    desc: '',
  }

  renderRightIcon() {
    const { rightIcon } = this.props

    if (!rightIcon) return null

    if (isString(rightIcon)) {
      return <img className={styles.rightIcon} src={rightIcon} alt="" />
    }

    return rightIcon
  }

  renderExtraInfo() {
    const { extra } = this.props

    if (!extra) return null

    return extra
  }

  render() {
    const { className, iconClass, type, icon, name, desc } = this.props

    const isImage = icon && icon.startsWith('/')

    const isWhite = type === 'white'

    return (
      <div className={classnames(styles.banner, className, styles[type])}>
        {this.renderRightIcon()}
        <div className={classnames(styles.icon, iconClass)}>
          {isImage ? (
            <img src={icon} alt="" />
          ) : (
            <Icon
              name={icon}
              type={isWhite ? 'dark' : 'light'}
              size={isWhite ? 40 : 36}
            />
          )}
        </div>
        <div className={styles.title}>
          <div className="h3">{name}</div>
          <p>{desc}</p>
        </div>
        {this.renderExtraInfo()}
      </div>
    )
  }
}
