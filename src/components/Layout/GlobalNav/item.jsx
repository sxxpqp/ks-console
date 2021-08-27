import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { Icon } from '@kube-design/components'

import styles from './index.scss'

export default class NavItem extends React.Component {
  static propTypes = {
    data: PropTypes.object,
  }

  renderIcon(icon) {
    return <Icon name={icon} />
  }

  render() {
    const { data, onClick, isHover, onHover } = this.props
    return (
      <Link
        to={`/${data.name}`}
        data-name={data.name}
        onClick={onClick}
        onMouseOver={onHover}
      >
        <div className={classNames(styles.nav, { [styles.active]: isHover })}>
          <div className={styles.icon}>
            <Icon name={data.icon} size={60} type="light" />
          </div>
          <div className={styles.title}>{t(data.title)}</div>
          <div className={styles.desc}>
            {t(
              data.desc ||
                `${data.title.replace(/\s/g, '_').toUpperCase()}_DESC`
            )}
          </div>
          <div className={styles.bottomIcon}>
            <Icon name={data.icon} size={320} type="light" />
          </div>
        </div>
      </Link>
    )
  }
}
