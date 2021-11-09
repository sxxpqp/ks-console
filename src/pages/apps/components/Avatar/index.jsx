import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

import { Image } from 'components/Base'

import styles from './index.scss'

export default class Avatar extends React.Component {
  static propTypes = {
    avatar: PropTypes.string,
    avatarClass: PropTypes.string,
    iconLetter: PropTypes.string,
    iconSize: PropTypes.number,
    title: PropTypes.string,
    desc: PropTypes.string,
    to: PropTypes.string,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    iconSize: 20,
    onClick: null,
  }

  renderImage() {
    const { avatar, iconLetter, iconSize, avatarClass } = this.props

    return (
      <label className={classNames(styles.image, avatarClass)}>
        <Image src={avatar} iconLetter={iconLetter} iconSize={iconSize} />
      </label>
    )
  }

  render() {
    const { title, desc, to, onClick, className, showIcon } = this.props

    const titleComponent = to ? (
      <Link to={{ pathname: to, state: { prevPath: location.pathname } }}>
        {title}
      </Link>
    ) : (
      title
    )

    return (
      <div className={classNames(styles.wrapper, className)}>
        {showIcon && this.renderImage()}
        <div
          className={classNames(
            showIcon && styles.title,
            showIcon && styles.isIcon,
            'avatar-title'
          )}
        >
          <div>
            <strong
              className={classNames({ [styles.canClick]: Boolean(onClick) })}
              onClick={onClick}
            >
              {titleComponent}
            </strong>
          </div>
          {desc && desc !== '-' && (
            <div className={styles.desc} title={desc}>
              {desc}
            </div>
          )}
        </div>
      </div>
    )
  }
}
