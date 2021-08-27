import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

import { Icon } from '@kube-design/components'

import styles from './index.scss'

export default class Info extends React.Component {
  static propTypes = {
    icon: PropTypes.string,
    iconProps: PropTypes.object,
    image: PropTypes.string,
    title: PropTypes.any,
    desc: PropTypes.any,
    size: PropTypes.string,
    width: PropTypes.number,
    url: PropTypes.string,
  }

  static defaultProps = {
    icon: '',
    iconProps: {},
    title: '',
    desc: '',
    size: 'default',
    width: 0,
  }

  renderContent() {
    const { icon, iconProps, image, title, desc, extra } = this.props

    return (
      <div>
        <div className={styles.icon}>
          {image ? (
            <img src={image} alt="" />
          ) : (
            <Icon name={icon} size={40} type="dark" {...iconProps} />
          )}
        </div>
        <div className={styles.text}>
          <div>{title}</div>
          <p>{desc}</p>
        </div>
        {extra}
      </div>
    )
  }

  render() {
    const { url, size, className } = this.props

    if (url) {
      return (
        <Link
          className={classNames(
            styles.info,
            styles.link,
            styles[size],
            className
          )}
          to={url}
        >
          {this.renderContent()}
        </Link>
      )
    }

    return (
      <div className={classNames(styles.info, styles[size], className)}>
        {this.renderContent()}
      </div>
    )
  }
}
